// insertAdjacentHTML() takes two parameter or argunent which are ('afterbegin', html)
// afterbegin => This occurs when we inseting a new child element at the beginning of a parent element
// beforeend => This occurs when we are inserting a new child element at the end of a parent element
// innerHTML returns all the element tags WHILE the textContent returns only the text in the UI
// beforeend => Order of each new movements elements will be added before the previous ones
// afterreend => Order of each new movements elements will be added after the previous ones
// findIndex() method => returns the index of a found element in an array and not the element itself
// Internalization => this will allow us to format dates and time according to the user's location or country

'use strict';

// BANK APP

const account1 = {
  owner: 'Qudus Adebiyi',
  movements: [
    3500, 24455.23, -10306.5, 25000, -27642.21, -14533.9, 3000.97, 110000,
    -5000, 20000,
  ],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-16T21:31:17.178Z',
    '2023-11-13T07:42:02.383Z',
    '2023-05-28T09:15:04.904Z',
    '2023-06-01T10:17:24.185Z',
    '2023-07-08T14:11:59.604Z',
    '2023-08-26T17:01:17.194Z',
    '2023-09-28T23:36:17.929Z',
    '2023-10-28T10:51:36.790Z',
    '2023-12-01T10:51:36.790Z',
    '2023-12-02T10:51:36.790Z',
  ],
  currency: 'NGN',
  locale: 'en-NG',
};

const account2 = {
  owner: 'Adebiyi Debowale',
  movements: [5000, 3400, -550, -700, -3210, -1000, 3000, 1000],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-12-01T13:15:33.035Z',
    '2023-04-30T09:48:16.867Z',
    '2023-05-25T06:04:23.907Z',
    '2023-06-25T14:18:46.235Z',
    '2023-07-05T16:33:06.386Z',
    '2023-08-10T14:43:26.374Z',
    '2023-09-25T18:49:59.371Z',
    '2023-10-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale) {
  // Create a functions that takes in two dates and parse the number of dates that passed between the two days
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); // Converting timestamp from milliseconds to  minutes, hour, and day

  // To get how many days passed since the current date and between the date we parse inside the formatMovementDate function
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Creating a function that will format any values, locale and currencies we want
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// To display movements
const displayMovements = function (acc, sort = false) {
  // Empty the container and start adding new element
  containerMovements.innerHTML = '';

  // If sort is set to true slice the current movement array and sort them in ascending order
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Getting current date with current index in the movement_date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // Formating the movements, curr acct locale and curr acct currency with the internalization number format
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // To create an HTML documents just like the one in the UI for the movements (Each of the movement-row)
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    // To attach the HTML code into the movements element container (UI), to do that we use insertAdjacent()method
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// Calculate and display balance in the UI
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // Display the current acct balance in the UI and formatting acct bal with the internalization number format
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Calculate and display summary in the UI
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  // Display and formatting incomes with the internalization number format
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // Display and formatting total withdrawals(out) with the internalization number format
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  // On each of the deposits we will receive 1.2%
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    // Bank new rule => banks only pays an interest only when the interest is more than 1 naira and then it will be added to the total interest
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // Display and formatting interest with the internalization number format
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//For each of the accounts, create a new property on each of the account object
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')

      // Using arrow function with Array map
      .map(name => name[0])
      // Return the index or position 0 from the accounts array and also join as a string
      .join('');
  });
};
createUsernames(accounts);

// To Update UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Creating a start logout timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); // The reaminder of dividing time by 60 = sec

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  // Find the account from the username the user inputed in the UI
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // Using optional chaining, if current account exist and the pin === inputLoginPin value then it will be executed
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time using internalization API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // To lose the focus on the pin input field, we use the blur() method
    inputLoginPin.blur();

    // Timer => if timer exist before the login clear the timer and after login call the timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    // If the receiver acct does not exist
    receiverAcc &&
    currentAccount.balance >= amount &&
    // Using optional chaining => If the receiver account exit then all the condition in the code block will executed but if it's receiver acct does'nt exist the code will fail
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    // Add a negative amount in the movements for current account after transfering out a certain amount
    currentAccount.movements.push(-amount);
    // Add a positive amount in the movements for receiver account after transfering out a certain amount from the current account
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer => Clear interval of the timer and reset a new one if we make any transfer trnsaction
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  // Check if at least one of the element in the movements array is > 10% of the amount
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // From the accounts array find or return the index of where account username(owner) === the currentaccount username
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// To sort with an event handler => setting sort to !sorted means true
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// To get movements from the UI and convert the elements into an array with an event listener
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements_value'),
    el => Number(el.textContent.replace('₦', ''))
  );
  console.log(movementsUI);
  // OR
  const movementsUI2 = [...document.querySelectorAll('.movememts_value')];
  console.log(movementsUI2);
});

// ARRAY PRACTICE METHOD
// 1. To calcualte how much has been deposited in total in the all the accounts across the bank
const bankDepositSum = accounts
  .flatMap(acct => acct.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

// 2. To count how many deposits have been in the bank with at least #1000
const numDeposits1000 = accounts
  .flatMap(acct => acct.movements)
  .filter(mov => mov >= 1000).length;

console.log(numDeposits1000);
// OR Using Array reduce
const myDeposits1000 = accounts
  .flatMap(acct => acct.movements)

  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(myDeposits1000);

// 3. Create an object in an array for deposits and withdrawals using Array reduce method
const { deposits, withdrawals } = accounts
  .flatMap(acct => acct.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);

      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);
