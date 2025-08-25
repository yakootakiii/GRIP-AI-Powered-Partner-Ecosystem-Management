// void main() {
//   print("exercise 1");
//   const int myAge = 20;

//   print('My age is $myAge years old.');

//   print("");
//   print("exercise 2 ");
//   int j = 10;
//   for (var i = 1; i <= j; i++) {
//     print(i);
//   }
// }

void performOperations(double num1, double num2) {
  print('Results between $num1 and $num2');
  double sum = num1 + num2;
  print('Addition: $sum');

  double difference = num1 - num2;
  print('Subtraction: $difference');

  double product = num1 * num2;
  print('Multiplication: $product');

  if (num2 != 0) {
    double quotient = num1 / num2;
    print('Division: $quotient');
  } else {
    print('Division: Cannot divide by zero.');
  }
}

void main() {
  performOperations(10.0, 5.0);
  print('');
}
