const selects = document.querySelectorAll(".select-container select");
const btn = document.querySelector(".btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const message = document.querySelector(".message");



async function populateCurrencies() {
  try {
    let response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) throw new Error("Failed to fetch currencies.");
    let data = await response.json();
    let currencies = Object.keys(data.rates);
    for (let select of selects) {
      select.innerHTML = "";
      for (let currencyCode of currencies) {
        let newOption = document.createElement("option");
        newOption.innerText = currencyCode;
        newOption.value = currencyCode;
        if (select.name === "from" && currencyCode === "USD") {
          newOption.selected = "selected";
        } else if (select.name === "to" && currencyCode === "INR") {
          newOption.selected = "selected";
        }
        select.append(newOption);
      }
    }
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    message.innerText = "Error Occurs.";
  }
}


function updateFlag(element) {
  let currencyCode = element.value;
  let countryCode = countryList[currencyCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let image = element.parentElement.querySelector("img");
  if (image) {
    image.src = newSrc;
  } else {
    console.error("Image element not found.");
  }
}



for (let select of selects) {
  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amount = document.querySelector(".amount input");
  let amountValue = parseFloat(amount.value);

  if (isNaN(amountValue) || amountValue <= 0) {
    amountValue = 0;
    amount.value = 0;
    message.innerText = "Please enter a valid amount.";
    return;
  }

  const URL = `https://open.er-api.com/v6/latest/${fromCurr.value.toUpperCase()}`;
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    let data = await response.json();
    let rate = data.rates[toCurr.value.toUpperCase()];
    if (!rate) throw new Error("Invalid currency code.");
    let finalAmount = amountValue * rate;
    message.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    console.error("Fetch error:", error);
    message.innerText = "Error fetching exchange rate. Please try again later.";
  }
});


populateCurrencies();