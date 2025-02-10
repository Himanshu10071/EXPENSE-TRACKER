 // making the add btn work
 let add_btn = document.querySelector('.add-btn');
 let modal = document.querySelector('.modal');

 add_btn.addEventListener('click', ()=>{
      modal.style.display = "flex";
    //   modal.classList.add('cursor-disable');
 }) 

 //making the close button in form work
 let close_btn = document.querySelector('.close-btn');
 close_btn.onclick = (()=>{
     modal.style.display = 'none';
     
 })





 let form = document.querySelector('.expenseForm');
 form.addEventListener('submit' , (e)=>{
    e.preventDefault();

     let formField = document.querySelectorAll('.expenseForm > div > input');
     let amount = formField[0].value;
     let date = formField[1].value;
     let note = formField[2].value;
     const id = shortid();
     let category = document.querySelector('#category').value;
    
     createExpenseCard(id , amount , category , date , note);
     modal.style.display = 'none';


     onlyNumbersInput();



    updatingExpenseArray(true , category , amount);

    updateBarChart(expenses);
        
    expenseArray.push({ uniqueID : id ,amount :amount , category:category , date :date , note : note});
    updateLocalStorage();

     
     e.target.reset();

     console.log(expenseArray);
 }) 


     

function createExpenseCard( id , amount , category , date , note){
    // console.log(amount , category , date , note);
    
    let expense_div = document.createElement('div');
    expense_div.classList.add('expense-card');
    expense_div.setAttribute('data-id', id);
    expense_div.setAttribute('data-category', category);
    expense_div.innerHTML = `<div class="top-row">
                                <div class="category editable" contenteditable = "false">${category}</div>
                                <div class="date" >${date}</div>
                            </div>
                            <div class="expense-card-bottom">
                                <div class="middle-row">
                                    <div class="amount editable" contenteditable = "false">${amount}</div>
                                    <div class="notes editable" contenteditable = "false">${note}</div>
                                </div>
                                
                                <div class="card-actions">
                                    <button class="action-btn edit-btn">Edit</button>
                                    <button class="action-btn delete-btn">Delete</button>
                                </div>
                            </div>
                            
                            `;

    // adding the expense card to the expense container 
    let expense_container = document.querySelector('.expense-container');
    expense_container.appendChild(expense_div);


    // expense delete
    expenseDelete(expense_div);


    //expense edit
    editable(expense_div);


    // total amount
    totalAmountSum(expense_div);

}


// making the delete btn work
function expenseDelete(expenseCard){
    let deleteBtn = expenseCard.querySelector('.delete-btn');
    let id = expenseCard.getAttribute('data-id');
    
    let index = expenseCardIndex(id);
    
    let category = expenseCard.getAttribute('data-category');

    let deletedAmount = expenseCard.querySelector('.amount').innerText;
    deletedAmount = Number(deletedAmount);
    deleteBtn.addEventListener('click', function(){
        updatingTotalAmountAfterDeleting(expenseCard);

        




        expenseArray.splice(index , 1);
        console.log(id);
        console.log(index);

        
        expenseCard.remove();


        updatingExpenseArray(false , category  ,deletedAmount);
        
        updateLocalStorage();
        

        updateBarChart(expenses);



        // 
        
    })
    
}








// updating total amount of money after deleting a expense
function updatingTotalAmountAfterDeleting(expenseCard){
    let amount =   expenseCard.querySelector('.amount').innerText;
    amount = Number(amount);
    let totalAmount = document.querySelector('.total-amount').innerText;
    totalAmount = Number(totalAmount);

    document.querySelector('.total-amount').innerText = totalAmount - amount;
}




function updatingTotalAmountAfterEditing(expenseCard , newAmount , oldAmount){
    newAmount = Number(newAmount);
    oldAmount = Number(oldAmount);
    let category = expenseCard.querySelector('.category').innerText;
    
    if(oldAmount>newAmount){
        let totalAmount = document.querySelector('.total-amount').innerText;
        totalAmount = Number(totalAmount);
        document.querySelector('.total-amount').innerText = totalAmount -oldAmount + newAmount ;
        let amount = (totalAmount - newAmount-oldAmount)
        updatingExpenseArray(true, category , amount);      
    }
    else{
        let totalAmount = document.querySelector('.total-amount').innerText;
        totalAmount = Number(totalAmount);

        document.querySelector('.total-amount').innerText = totalAmount + newAmount - oldAmount;

        let amount =  (totalAmount + newAmount-oldAmount);
        updatingExpenseArray(true , category , amount);
    }

    
}

// making the edit button work
function editable(expenseCard){
    let edit_btn_flag = true;

    let editBtn = expenseCard.querySelector('.edit-btn');
    let allEditables = expenseCard.querySelectorAll('.editable');

    let oldAmount = expenseCard.querySelector('.amount').innerText;

    editBtn.addEventListener('click',()=>{
        
        if(edit_btn_flag){
            allEditables.forEach((editable) => {
                editable.setAttribute('contenteditable' , true);  
            })
            editBtn.innerText = "Save";

        }
        else{
            allEditables.forEach((editable) => {
                editable.setAttribute('contenteditable' , false);  
            })
            editBtn.innerText = "Edit";

            const newAmount = expenseCard.querySelector('.amount').innerText;
            updatingTotalAmountAfterEditing(expenseCard , newAmount , oldAmount);

            // let arrayFromLocalStorage = JSON.parse(localStorage.getItem('chartData')) || [];
            // updateBarChart(arrayFromLocalStorage);
        }
        edit_btn_flag = !edit_btn_flag;
    })
    
}




// taking care of the total sum
function totalAmountSum(expenseCard){
    let previousExpense = document.querySelector('.total-amount').innerText;

    previousExpense = Number(previousExpense);

    let cardAmount = expenseCard.querySelector('.amount').innerText;
    cardAmount = Number(cardAmount);

    
    //updating total amount
    document.querySelector('.total-amount').innerText = Number(cardAmount + previousExpense);

}



 function expenseCardIndex(id){
    // let expenseCards = document.querySelectorAll('.expense-card');
    // let index;
    // console.log(expenseCards);
    // for(let i = 0 ;i<expenseCards.length;i++){
    //     if(id===expenseCards[i].getAttribute('data-id')){
    //         index = i;
    //         break;
    //     }
    // }
    
    // return index;

    const Index = expenseArray.findIndex(function (expense) {
        return expense.uniqueID === id;
      });
      return Index;
 }








 // bar chart js
 let expenses = [
    { category: "shopping", amount: 0 },
    { category: "entertainment", amount: 0 },
    { category: "education", amount: 0 },
    { category: "vehicle", amount: 0 },
    { category: "household", amount:0 },
    { category: "insurance", amount: 0 }
];



function updatingExpenseArray(flag , category , amount){
    let index = expenses.findIndex(element => {
        return element.category===category;
    })


    if(flag){
        expenses[index].amount += Number(amount);
    }
    else{
        if(expenses[index].amount - Number(amount)<0) expenses[index].amount = 0;
        else expenses[index].amount -= Number(amount)
    } 
}




// Category colors
const categoryColors = {
    shopping: "#8b5cf6",
    entertainment: "#ec4899",
    education: "#10b981",
    vehicle: "#f59e0b",
    household: "#3b82f6",
    insurance: "#ef4444"
};



// function to update the bar graph 
function updateBarChart(expenses) {

    let total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    let barChart = document.getElementById("barChart");
    barChart.innerHTML = ""; 

    expenses.forEach(exp => {
        let barHeight = (exp.amount / total) * 100;
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${barHeight}%`;
        bar.style.background = categoryColors[exp.category.toLowerCase()] || "#ccc"; // Assign color
        bar.setAttribute("data-amount", `${exp.amount}`);
        bar.innerHTML = `<small>${exp.category}</small>`;
        barChart.appendChild(bar);
    });

}





// making the filter function work

let filterValue = document.querySelector('.filter-by-category');

filterValue.addEventListener('change' , ()=>{
    let selected_category_value = filterValue.value;
    let expenses = document.querySelectorAll('.expense-card');

    expenses.forEach((expense) => {
        if(expense.getAttribute('data-category')===selected_category_value) expense.style.display = "block";
        else expense.style.display = "none";
    })
})


let removeFilter = document.querySelector('.remove_filter').onclick = (()=>{
    let expenses = document.querySelectorAll('.expense-card');
    expenses.forEach((expense) => {
         expense.style.display = "block";
    })
})






// changing currency works

const apiKey = "b9b54952e6aba45b3c4c4def"; 
const API_URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

let currencySelect = document.querySelector('.currency-select');

async function addCurrenciesInSelect() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const currencies = Object.keys(data.conversion_rates);

        
        currencies.forEach(currency => {
            let option1 = document.createElement("option");
            option1.value = currency;
            option1.textContent = currency;
          
            currencySelect.appendChild(option1);
        });

        // Set default values
        
    } catch (error) {
        console.error("Error loading currencies:", error);
        alert("Failed to load currency list. Try again later.");
    }
}


addCurrenciesInSelect();



// //  to change the currency to all the expenses



let from = 'INR';
currencySelect.addEventListener('change', async () => {
    let amounts = document.querySelectorAll('.amount');
    let to = currencySelect.value;
    
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`);
        const data = await response.json();
        
        // Only proceed if we're actually changing to a different currency
        if (to !== from && data.conversion_rates[to]) {
            amounts.forEach((amountElement) => {
                let value = amountElement.innerText;
                amountElement.innerText = (value * data.conversion_rates[to]).toFixed(2);
            });
        }
            // Update current currency display
            let currentCurrency = document.querySelector('.current-currency');
            currentCurrency.innerText = to;
            
            // Update expense array and chart data
            let allExpensesCards = document.querySelectorAll('.expense-card');
            allExpensesCards.forEach((card, index) => {
                let newAmount = Number(card.querySelector('.amount').innerText);
                let category = card.getAttribute('data-category');
                expenseArray[index].amount = newAmount;
                
                // Update the chart data
                let expenseIndex = expenses.findIndex(exp => exp.category === category);
                if (expenseIndex !== -1) {
                    expenses[expenseIndex].amount = newAmount;
                }
            });
            
            // Update the from currency AFTER all conversions are done
            from = to;
            
            // Store current currency
            localStorage.setItem('currency', JSON.stringify([{currency: to}]));
            updateLocalStorage();
            
            
        
    } catch(error) {
        console.error("Error changing currency:", error);
    }
});

// making the amount while editing only numbers
function onlyNumbersInput(){
    const amountDivs = document.querySelectorAll(".amount");
    amountDivs.forEach(div => {
        div.addEventListener('keypress' , (e)=>{

            if (
                e.key === "Backspace" ||
                e.key === "Delete" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Enter"
            ) {
                return; 
            }
            if(!/[0-9]/.test(e.key)){
                    window.alert('Please Enter A Number');
            }
        })

        div.addEventListener("input", function () {
            this.innerText = this.innerText.replace(/\D/g, ""); // Remove all non-digit characters
        });
    })
}







let expenseArray = JSON.parse(localStorage.getItem("expenses")) || [];


// making expenses
function initialize(){
   // making the expense card works
   for (let i = 0; i < expenseArray.length; i++) {
       createExpenseCard(
            expenseArray[i].uniqueID,
           expenseArray[i].amount,
           expenseArray[i].category,
           expenseArray[i].date,
           expenseArray[i].note
       );
   }

   // making the chart data presists
   let arrayFromLocalStorage = JSON.parse(localStorage.getItem('chartData')) || [];
   updateBarChart(arrayFromLocalStorage);
   

   // setting uup the currenct currency
   let currentCurrency = document.querySelector('.current-currency');
    currentCurrency.innerText = JSON.parse(localStorage.getItem('currency'))[0].currency;



   // making the initial currency INR
    let amounts = document.querySelectorAll('.amount');
    if(amounts.length==1){
        localStorage.setItem('currency' , JSON.stringify([{currency : 'INR'}]));
    }
}
initialize();





function updateLocalStorage(){
    localStorage.setItem("expenses", JSON.stringify(expenseArray));
    localStorage.setItem("chartData" , JSON.stringify(expenses));
}



