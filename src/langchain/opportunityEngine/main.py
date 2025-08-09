# main.py
# Run:
#   export GOOGLE_API_KEY="AIzaSyAAzH7Oya2FSQxDuWfiYYix-oTXgVUkt1Y"
#   uvicorn main:app --reload
# Docs: http://127.0.0.1:8000/docs

from fastapi import FastAPI, File, UploadFile
from typing import Optional
import pandas as pd
import io
import os
import re
import json
from datetime import datetime
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

app = FastAPI(title="Investor Opportunity Engine")

# === LLM Setup ===
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("Please set the GOOGLE_API_KEY environment variable before running the app.")

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.2,
    google_api_key=GOOGLE_API_KEY
)

# === Helpers ===
def load_file_to_df(upload: UploadFile) -> pd.DataFrame:
    if upload is None:
        return None
    content = await_read(upload)
    filename = upload.filename.lower()
    if filename.endswith(".csv"):
        return pd.read_csv(io.BytesIO(content))
    elif filename.endswith(".xlsx") or filename.endswith(".xls"):
        return pd.read_excel(io.BytesIO(content))
    else:
        raise ValueError("Unsupported file type. Please upload .csv or .xlsx")

def await_read(upload: UploadFile) -> bytes:
    # UploadFile.file.read() is synchronous; FastAPI provides file-like object — we read bytes
    content = upload.file.read()
    # rewind for possible reuse
    try:
        upload.file.seek(0)
    except Exception:
        pass
    return content

def calculate_metrics(transactions_df: pd.DataFrame) -> dict:
    required = {"date", "revenue", "cost"}
    if not required.issubset(set(transactions_df.columns)):
        raise ValueError(f"Transactions file must contain columns: {sorted(required)}")

    transactions_df = transactions_df.copy()
    transactions_df["date"] = pd.to_datetime(transactions_df["date"])
    # ensure numeric
    transactions_df["revenue"] = pd.to_numeric(transactions_df["revenue"], errors="coerce").fillna(0.0)
    transactions_df["cost"] = pd.to_numeric(transactions_df["cost"], errors="coerce").fillna(0.0)

    total_revenue = float(transactions_df["revenue"].sum())
    total_cost = float(transactions_df["cost"].sum())
    net_profit = float(total_revenue - total_cost)

    # monthly aggregation
    monthly = transactions_df.set_index("date").resample("M")["revenue"].sum()
    months_of_data = int(len(monthly))
    avg_monthly_revenue = float(monthly.mean()) if months_of_data > 0 else 0.0

    # growth: (last - first)/first *100 if enough data and first !=0
    growth_rate_percent = None
    if months_of_data >= 2 and monthly.iloc[0] != 0:
        growth_rate_percent = float((monthly.iloc[-1] - monthly.iloc[0]) / monthly.iloc[0] * 100)

    # annualize net profit
    if months_of_data > 0:
        annualized_net_profit = float(net_profit * (12.0 / months_of_data))
    else:
        annualized_net_profit = None

    return {
        "total_revenue": total_revenue,
        "total_cost": total_cost,
        "net_profit": net_profit,
        "months_of_data": months_of_data,
        "avg_monthly_revenue": avg_monthly_revenue,
        "growth_rate_percent": growth_rate_percent,
        "annualized_net_profit": annualized_net_profit
    }

def estimate_valuation(annual_revenue: float, growth_rate_percent: Optional[float]) -> float:
    """
    Very simple heuristic valuation:
    - Choose revenue multiple based on growth:
        >50% -> 6x
        20-50% -> 4x
        0-20% -> 2.5x
        negative or unknown -> 1.5x
    """
    if annual_revenue is None:
        return None
    multiple = 1.5
    if growth_rate_percent is None:
        multiple = 1.5
    elif growth_rate_percent > 50:
        multiple = 6.0
    elif growth_rate_percent > 20:
        multiple = 4.0
    elif growth_rate_percent >= 0:
        multiple = 2.5
    else:
        multiple = 1.5
    return float(max(0.0, annual_revenue * multiple))

def derive_recommended_investment_range(valuation: float, growth_rate_percent: Optional[float]) -> dict:
    """
    Suggest a conservative investment range as percentage of valuation:
    - low % depends on growth: faster growth -> larger share allowed
    Returns min and max recommended investment amounts.
    """
    if valuation is None:
        return {"min": None, "max": None}
    # baseline percentages
    if growth_rate_percent is None:
        low_pct, high_pct = 0.02, 0.06
    elif growth_rate_percent > 50:
        low_pct, high_pct = 0.05, 0.2
    elif growth_rate_percent > 20:
        low_pct, high_pct = 0.04, 0.15
    elif growth_rate_percent >= 0:
        low_pct, high_pct = 0.03, 0.1
    else:
        low_pct, high_pct = 0.02, 0.05
    return {"min": float(valuation * low_pct), "max": float(valuation * high_pct)}

def compute_roi_projections(annualized_net_profit: Optional[float], invest_min: float, invest_max: float):
    """
    Simple ROI projections:
    - baseline ROI = annualized_net_profit / investment
    - projected ROI with uplift assumptions: low invest -> +10% revenue, high invest -> +30% revenue
    """
    projections = {}
    if annualized_net_profit is None or invest_min is None or invest_max is None:
        return projections

    baseline_min = (annualized_net_profit / invest_min * 100) if invest_min > 0 else None
    baseline_max = (annualized_net_profit / invest_max * 100) if invest_max > 0 else None

    # Uplift: conservative assumptions
    uplift_low = 0.10  # 10% revenue uplift with small investment
    uplift_high = 0.30  # 30% revenue uplift with larger investment

    # approximate additional profit = uplift * annualized_revenue (but we don't have annualized revenue here explicitly)
    # We'll approximate using annualized_net_profit as proxy for profit; assume uplift scales to profit similarly (conservative)
    uplift_profit_low = annualized_net_profit * uplift_low
    uplift_profit_high = annualized_net_profit * uplift_high

    projected_min = ((annualized_net_profit + uplift_profit_low) / invest_min * 100) if invest_min > 0 else None
    projected_max = ((annualized_net_profit + uplift_profit_high) / invest_max * 100) if invest_max > 0 else None

    projections["baseline"] = {
        "roi_percent_min_investment": baseline_min,
        "roi_percent_max_investment": baseline_max
    }
    projections["with_uplift"] = {
        "assumption_uplift_low_pct": uplift_low * 100,
        "assumption_uplift_high_pct": uplift_high * 100,
        "projected_roi_percent_min_investment": projected_min,
        "projected_roi_percent_max_investment": projected_max
    }
    return projections

def compute_risk_score(transactions_df: pd.DataFrame, payments_df: Optional[pd.DataFrame], metrics: dict) -> dict:
    """
    Light heuristic to compute risk score and drivers:
    - Low months_of_data -> higher risk
    - Negative or volatile growth -> higher risk
    - Payments coverage (total_paid / total_revenue) low -> higher risk
    """
    months = metrics.get("months_of_data", 0)
    growth = metrics.get("growth_rate_percent", None)
    total_revenue = metrics.get("total_revenue", 0.0)

    # payments coverage
    coverage = None
    if payments_df is not None and "amount_paid" in payments_df.columns:
        payments_df["amount_paid"] = pd.to_numeric(payments_df["amount_paid"], errors="coerce").fillna(0.0)
        total_paid = float(payments_df["amount_paid"].sum())
        coverage = total_paid / total_revenue if total_revenue > 0 else None

    score = 0
    reasons = []

    # months factor
    if months < 3:
        score += 2
        reasons.append("Very limited historic data (<3 months).")
    elif months < 6:
        score += 1
        reasons.append("Limited historic data (3-6 months).")
    else:
        reasons.append("Sufficient historic data (>6 months).")

    # growth factor
    if growth is None:
        score += 1
        reasons.append("Growth rate unknown.")
    elif growth < 0:
        score += 2
        reasons.append(f"Negative growth ({growth:.1f}%).")
    elif growth < 10:
        score += 1
        reasons.append(f"Low growth ({growth:.1f}%).")
    else:
        reasons.append(f"Healthy growth ({growth:.1f}%).")

    # payment coverage
    if coverage is None:
        score += 1
        reasons.append("Payment coverage unknown.")
    elif coverage < 0.7:
        score += 2
        reasons.append(f"Low payment collection rate ({coverage:.2f}).")
    else:
        reasons.append(f"Good payment collection rate ({coverage:.2f}).")

    # translate score to risk band
    if score <= 1:
        band = "Low"
    elif score <= 3:
        band = "Medium"
    else:
        band = "High"

    return {"risk_score": band, "raw_score": int(score), "drivers": reasons}

def clean_and_parse_llm_output(raw: str):
    text = raw.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        m = re.search(r"(\{[\s\S]*\})", text)
        if m:
            try:
                return json.loads(m.group(1))
            except Exception:
                pass
    return {"raw_text": text}

# === LLM prompt for investor analysis ===
investor_prompt = PromptTemplate.from_template(
    """
You are an experienced investor analyst writing for other investors.
Given the following partner/company profile and computed numeric metrics, produce a concise JSON object that helps an investor decide whether to invest.

Input:
- profile_text: {profile_text}
- metrics (JSON): {metrics_json}
- valuation_estimate: {valuation}
- recommended_investment_range: {invest_min} - {invest_max}
- roi_projections (JSON): {roi_json}
- risk (JSON): {risk_json}

Task:
Return ONLY valid JSON with keys:
- investment_summary: short string (yes/no + 1-sentence rationale)
- recommended_investment_amount: number (single recommended amount within the provided range) 
- expected_payback_months: number or string range
- high_level_strategy: array of 2-3 bullet strings explaining how investor money should be used (e.g., product dev, sales)
- main_risks: array of strings
- confidence: one-line confidence note (e.g., 'Low / Medium / High confidence' and reason)

Do not output any extra text.
"""
)

@app.post("/investor_opportunity")
async def investor_opportunity(
    profile_text: str,
    transactions_file: UploadFile = File(...),
    payments_file: Optional[UploadFile] = None
):
    """
    Investor-focused opportunity endpoint.
    """
    try:
        # load files
        tx_bytes = await_read(transactions_file)
        transactions_df = pd.read_csv(io.BytesIO(tx_bytes)) if transactions_file.filename.lower().endswith(".csv") \
            else pd.read_excel(io.BytesIO(tx_bytes))

        payments_df = None
        if payments_file is not None:
            pay_bytes = await_read(payments_file)
            payments_df = pd.read_csv(io.BytesIO(pay_bytes)) if payments_file.filename.lower().endswith(".csv") \
                else pd.read_excel(io.BytesIO(pay_bytes))

        # metrics
        metrics = calculate_metrics(transactions_df)

        # compute derived values
        annualized_revenue = metrics["avg_monthly_revenue"] * 12 if metrics["avg_monthly_revenue"] is not None else None
        valuation = estimate_valuation(annualized_revenue, metrics.get("growth_rate_percent"))
        invest_range = derive_recommended_investment_range(valuation, metrics.get("growth_rate_percent"))
        invest_min = invest_range.get("min")
        invest_max = invest_range.get("max")

        projections = compute_roi_projections(metrics.get("annualized_net_profit"), invest_min, invest_max)
        risk = compute_risk_score(transactions_df, payments_df, metrics)

        # prepare LLM prompt context
        metrics_json = json.dumps(metrics, default=str)
        roi_json = json.dumps(projections, default=str)
        risk_json = json.dumps(risk, default=str)

        prompt_text = investor_prompt.format(
            profile_text=profile_text,
            metrics_json=metrics_json,
            valuation=valuation,
            invest_min=invest_min,
            invest_max=invest_max,
            roi_json=roi_json,
            risk_json=risk_json
        )

        # call LLM
        llm_result = llm.invoke(prompt_text)

        # extract raw text
        raw_output = ""
        if isinstance(llm_result, dict):
            raw_output = llm_result.get("text") or llm_result.get("output") or llm_result.get("content") or str(llm_result)
        else:
            raw_output = getattr(llm_result, "content", None) or str(llm_result)

        parsed_llm = clean_and_parse_llm_output(raw_output)

        # final response
        response = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "metrics": metrics,
            "annualized_revenue_estimate": annualized_revenue,
            "valuation_estimate": valuation,
            "recommended_investment_range": invest_range,
            "roi_projections": projections,
            "risk": risk,
            "llm_investment_advice": parsed_llm
        }
        return response

    except ValueError as ve:
        return {"error": str(ve)}
    except Exception as e:
        return {"error": "Unexpected error", "detail": str(e)}
