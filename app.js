//****************************************************Budget Controller********************************************//
var budgetcontroller = (function () {

    var Income = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expense = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalInc) {

        if(totalInc > 0){

            this.percentage = Math.round((this.value/totalInc)*100);
        }
        else{
            this.percentage = -1;
        }
        
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var data = {
        allItems: {
            inc: [],
            exp: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    };

    calculateTotal = function (type) {

        var sum = 0;
        data.allItems[type].forEach(function (cur) {

            sum += cur.value;
        });
        data.totals[type] = sum;

    }





    return {
        addItem: function (type, des, val) {

            var newItem, ID;
            //create New Id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //create NewItems Based on inc or exp 
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push New Items 
            data.allItems[type].push(newItem);

            //Return the new Element
            return newItem;
        },


        deleteItem: function(type,id){
              var ids,index;
            
           ids = data.allItems[type].map(function(current){
                return current.id;
     
            });
            

            index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index,1);
            }

        },


        calculateBudget: function () {
            //Calculate total income and total expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget income - expenses

            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = 0;
            }

        },
       
       calculatePercentages: function(){
        data.allItems.exp.forEach(function(current){
            current.calcPercentage(data.totals.inc);
        });

       },
       getPercentages: function(){

        var allPerc = data.allItems.exp.map(function(current){

            return current.getPercentage();
        });
        return allPerc;
       },
       
        getBudget: function () {

            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };

        },

        testing: function () {
            console.log(data);
        }


    };

})();




//********************************UI Controller*********************************************//



var  UIcontroller = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncLabel: '.budget__income--value',
        budgetExpLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
        Expensesperc:'.item__percentage',
        display:'.budget__title--month'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {

            var html, newHtml;

            //Create Html page with placeholder data

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }


            //replace Html page with the placeholder data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //Insert Html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },
        deleteListItem: function(selectorID){

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current) {
                current.value = "";

            });
            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.budgetIncLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.budgetExpLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';


        },
        dsiplayPercentage: function(percentages){

            var fields = document.querySelectorAll(DOMstrings.Expensesperc);
            

            var nodeListForEach = function(list,callback){
                for(var i = 0; i<list.length; i++){
                    callback(list[i],i);
                 }
            };
            nodeListForEach(fields,function(current,index){

                if(percentages[index] > 0){

                    current.textContent = percentages[index] + '%';
                }
                else{
                    current.textContent = '---';
                }
                
            })
            


        },
        displayMonth: function(){

           months = ['Baishak','Jestha','Ashar','Shrawn','Bhadau','Ashoj','Kartik','Mangsir','Poush','Magh','Falgun','Chaitra'];

            var now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            

                document.querySelector(DOMstrings.display).textContent = months[month+9] + ' ' + (year+56);
            

        },


        getDOMstrings: function () {
            return DOMstrings;
        }


    };
})();




//**************************************************GLOBAL APP CONTROLLER**************************************//



var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListner = function () {
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    }



    var UpdateBudget = function () {
        //Calculate The Budget
        budgetCtrl.calculateBudget();

        //return the Budget
        var budget = budgetCtrl.getBudget();

        //Update the UI 
        UICtrl.displayBudget(budget);

    }

    var updatePercentages = function(){


        //Calculate Percentages

        budgetCtrl.calculatePercentages();

        //read percentages from the budget calculator

        var percentages = budgetCtrl.getPercentages();


        //update the UI with the Calcualted percentages 

        UICtrl.dsiplayPercentage(percentages);
        
    }


    var DOM = UICtrl.getDOMstrings();
    
    
    
    var ctrlAddItem = function () {
        var input, newItem;

        //1 Get Input
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //Add Item to the BudgetController
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //Update the UI 

            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
        }
        //Calculate the Budget

        budgetCtrl.calculateBudget();

        //Update the budget to the UI
            UpdateBudget();
            updatePercentages();

      };

      ctrlDeleteItem = function (event){
        var itemID, type,ID,splitID; 
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            type = type.slice(0,3);
            ID = parseInt(splitID[1]);


            //Delete The Item From The Data Structure
            budgetCtrl.deleteItem(type,ID);


            //Delete the item from the UI

            UICtrl.deleteListItem(itemID);

            //Updae the UI

            UpdateBudget();
            updatePercentages();


        }

      }

    return {
        init: function () {

            setupEventListner();
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
        }
    };


})(budgetcontroller, UIcontroller);


controller.init();