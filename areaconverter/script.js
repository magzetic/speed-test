// Conversion factors
const sqftToHectareFactor = 0.0000092903;
const hectareToSqftFactor = 107639.104;
const hectareToDecimalFactor = 250;
const decimalToHectareFactor = 1 / 250;

// Sqft and Hectare Conversion
document
  .getElementById('sqft-hectare-btn')
  .addEventListener('click', function () {
    const conversionType = document.getElementById('sqft-hectare-select').value;
    const inputValue = parseFloat(
      document.getElementById('sqft-hectare-input').value
    );

    if (isNaN(inputValue)) {
      document.getElementById('sqft-hectare-result').textContent =
        'Please enter a valid number';
      return;
    }

    let result = 0;

    if (conversionType === 'sqft-to-hectare') {
      result = inputValue * sqftToHectareFactor;
    } else if (conversionType === 'hectare-to-sqft') {
      result = inputValue * hectareToSqftFactor;
    }

    document.getElementById(
      'sqft-hectare-result'
    ).textContent = `Result: ${result.toFixed(6)}`;
  });

// Hectare and Decimal Conversion
document
  .getElementById('hectare-decimal-btn')
  .addEventListener('click', function () {
    const conversionType = document.getElementById(
      'hectare-decimal-select'
    ).value;
    const inputValue = parseFloat(
      document.getElementById('hectare-decimal-input').value
    );

    if (isNaN(inputValue)) {
      document.getElementById('hectare-decimal-result').textContent =
        'Please enter a valid number';
      return;
    }

    let result = 0;

    if (conversionType === 'hectare-to-decimal') {
      result = inputValue * hectareToDecimalFactor;
    } else if (conversionType === 'decimal-to-hectare') {
      result = inputValue * decimalToHectareFactor;
    }

    document.getElementById(
      'hectare-decimal-result'
    ).textContent = `Result: ${result.toFixed(6)}`;
  });
