// we first selected the checkbox and then added event listner to it which trigger by change in it 'change', and calls the function selectall, here we didn't provide the fucntion as selectall() beacuse then it will be called immediately , not as a reference , we needed to provide reference
document.getElementById('selectallcheckbox').addEventListener('change',selectall);







//if a key-value pair is not in local storage and you try to retrive is ,we get null , this below 'if' provided here so that we don't need to check if payment array is there in storage each time we add a entry using function makeentry() so we check it at very start each time page loads or refresh
if(localStorage.getItem('payments')===null)
    {
        const payments =[]; //arrays are actually reference not actual data so we create them using const , so that we don't change them accidently
        localStorage.setItem('payments',JSON.stringify(payments)); //we can't store array directly in local storage  so we need it to convert to a json object which is effectively a string so it can be stored , here the first parameter is the key and second is the value
    }






//same  goes for this if , we need to keep a track of no. of entries made , but we need it there in storage initially , so we don't face problem in the fucntion which is called again and again regarding entries made, there was one other option also to make a global var , but it will loose the value if page gets refreshed
if(localStorage.getItem('entriesmade')===null)
{
    localStorage.setItem('entriesmade','0');
}




renderpage();//to load which ever page based on data already entered , we need this in case user refresh the page




//this function is called if we hit reset button befor entering all the names , so giving a option to restart anytime 
function resetallwhenaddnames(){
    localStorage.clear();
    {
        const payments =[];
        localStorage.setItem('payments',JSON.stringify(payments));
        localStorage.setItem('entriesmade','0');
    }
    
    document.getElementById('added-names').innerHTML=''; //clears already added names
    document.getElementById('added-names').classList.add('hidden');// the div in which names are shown needs to be hidden because now the background and div have different colors
    document.getElementById('friends-number-input-field').value=''; //so we can add no. of friends again without needing to clear previous entry
    document.getElementById('friendnumber').innerText='1';//to reset the span number or friend no.
    document.getElementById('friends-inputed-name').value=''; //clear name entring field
    document.getElementById('take-names-entry-div').style.display='none'; //hide the name entring form
    document.getElementById('how-many-friends').style.display='flex'; //this shows the form of entring friends number
}





//this below function is simply to clear the field if we want to start everything again and stuff
function resetall(){
    document.getElementById('final-calculated-result').innerHTML=""; //  to clear the final calculted result of last session ,this is direct and easiest way , compared to removing each child one0-by-one using remove() function 
    localStorage.clear(); //this will clear the local storage of any previous data becuase we want it to be entered again 

    //this below section is required because when we press reset button the page is not reloading or refreshing ,hence your 2 if's in above code won't run and the local storage is already cleared empty and we need payments array and entriesmade in storage to work with
    {
        const payments =[];
        localStorage.setItem('payments',JSON.stringify(payments));
        localStorage.setItem('entriesmade','0');
    }
    //note:- this above section will get executed even if somehow you return from this function based on a condition ,intending that rest of code don't execute , because no matter what , code inside curly braces without condition always gets executed in js so we put this in a else condition

    document.getElementById('how-many-friends').style.display='flex'; //after reset we go to first page of taking no of friends input so we make it visible 
    
    document.getElementById('drop-down-for-payee').innerHTML = ''; // needs to be cleared out because next time the names won't be same ,so we need previous drop down cleared and this is the fastest way

    //this below line of code removed the selectall checkbox and then put it again newly ,but this is not the same to previous one in some sense althought they are same , so we lost our eventlistner attached with it so what we are going to do is add the event listner again here after modificaiton 
    document.getElementById('parent-checkbox-div').innerHTML=`<div id="selectalldiv" class="flex items-center my-2">
                                                                <label class="text-lg" for="selectall">select all</label>
                                                                <input id="selectallcheckbox" class="h-5 w-5 ml-3 " type="checkbox">
                                                               </div>`;//this is the select all checkbox , we don't render it , we hard code it ,so this above code

    document.getElementById('selectallcheckbox').addEventListener('change',selectall);//adding eventlistner to selectall checkbox again because previous one got cleared when we changed innerhtml of parent-checkbox-div
    document.getElementById('reset-all-after-all-name-added').classList.add('hidden');// the page that we get in the last ,we want it to hide ,so we added hidden class of tailwind css to its classlist
    
    document.getElementById('friends-number-input-field').value='';//we want the field to be empty to enter the nooffiends when we reset , if we don't use this line , it won't be , this basically selects the element by id , and sets it value to empty .
    
    
}







//this function stores the total no of friends there will be among whom the split is to be done , this function is called when the enter key is pressed in the input field of " how many friends? "
function noOfpeople(){
    let nooffriends=document.getElementById('friends-number-input-field').value; //select input field and get its value and store it  in a variable
    //this is to makes sure max no. of people allowed , if entered no. of friends is greater than a given no ,  we alert the user about it and do nothing and return
    if(nooffriends>10){
        alert('The max size allowed is 10 people');
        document.getElementById('friends-number-input-field').value='';
        return;
    }
    if(nooffriends<2)
        {
            alert('There should be atleast two people');
            document.getElementById('friends-number-input-field').value='';
            return;
        }
    localStorage.setItem('nooffriends',nooffriends); //i stored the value in local storage so that i dont have to make the nooffriends variable global
    document.getElementById('how-many-friends').style.display='none'; // now that we have no. of friends we need to hide the option to enter the no. of friends other wise users will mendle with it anytime , creating errors in the code
    document.getElementById('take-names-entry-div').style.display='block'; //now that we have how many friends there are going to be we want to display a div in which we take entries of the names and meanwhile hide the question ,how many friends are there.
    localStorage.setItem('namesadded',0); //this is the point where no name is added yet , so to keep track or how many names added , we created a local storage key-value for the names added

}






//this function is to add the name entered to the local storage and also show it on the page , so we will be calling the rendering function from here to show stuff , and we will also keep an eye for max allowings
function addnametolist(){
    let totaladdednames=parseInt(localStorage.getItem('namesadded'));
    let name =document.getElementById('friends-inputed-name').value;
    let b =parseInt(localStorage.getItem('nooffriends')); //parseint coz nooffriends is stored as string
    
    if(name==='')//is no name is entered we don't want to go any further
        {
            return;
        }
    else if(b>totaladdednames)//this code runs if the names entered are still less than the total allowed
    {   
        //added-names div is visible even without anyelements ,so i had to hide it , this below if is for that , to make sure that when we add names , if addednames is hidden unhide is , this is basically intended when first name get inputed but , if i had gone with some other method to run this only for first name , it could have gotten comlicated
        //although now that i think about it could have checked namesadded ,if it was zero i unhide the  div otherwise it's already unhidden
        if(document.getElementById("added-names").classList.contains('hidden'))
            {
                document.getElementById("added-names").classList.remove('hidden');
            }
        localStorage.setItem(totaladdednames,name);//this stores the newly added name to the localstorage with key as a number 
        

        
        document.getElementById('friends-inputed-name').value='';//once the name is entered we want the input field to be clear for new name
        rendertopage(name);//this will place the newly added name on the page 
        totaladdednames++;//since a new new is added we want to increase namesadded and that is done here
        localStorage.setItem('namesadded',totaladdednames);

        //this if runs if the last name is added otherwise in else of this if we provide the no. of friend that needs to entered next 
        //this if takes the last name entered and render it to page and hide the entring input field , and then after two seconds also hide the names entered
        if(b===(totaladdednames))
        {
            
            rendertopage(document.getElementById('friends-inputed-name').value);//render the last name to page
            document.getElementById('friends-inputed-name').value='';//clearing the input filed
            document.getElementById('take-names-entry-div').style.display='none';//hide the name input form 
            //this set timeout removes the names that were rendered to the page ,here i could have just direclty set the innerHTML to empty string
            setTimeout(() => {
                
                document.querySelectorAll('.name-para-divs').forEach(div=>{ div.remove();});
                document.getElementById("added-names").classList.add('hidden'); //we want the names div to be hidden once all names have been added
                document.getElementById('reset-all-after-all-name-added').classList.remove('hidden');//this will show the final page where we enter the payment entries by removing it's hidden class 
                
                renderdropdown();//this is to render the dropdown options based on the names that we entered 
                
            }, 2000);
            
        }
        else
        {
            document.getElementById('friendnumber').innerText=totaladdednames+1;//this will increase the number in span untill last name is entered
        }
        
    }
}






//this function is to render the names to page as we enter them for the user to see that he has entered correct names
function rendertopage(name){
        let newdiv=document.createElement('div');//create a div for the new name each time
        newdiv.style.display='flex';//make the css display of new div to flex
        newdiv.classList.add('name-para-divs');//the above line could have been combined with this one ,by adding multiple class , comma seperated

        //this is essential the inner html of this new div, we used here backtick string , so that we can add variable values on the go in one line 
        newdiv.innerHTML=`
        <p class="first-letter:uppercase text-lg my-1
        mx-5">${name}</p>
        `;

        document.getElementById('added-names').appendChild(newdiv);

       //this below code gave unexpected result ,because we wanted to insert the newdiv inside added-names but below code was inserting it adjacet to added-names
       // document.getElementById('added-names').insertAdjacentElement("beforebegin",newdiv); 
       // here i could have also used appedchild(newdiv) ,but i used this approach in one of my other project , so i went for this , here the element are inserted with reference to other element so you can determine or adjust , how they get added on the page
}




//this function is called whenever you refresh the page or at the initial stage
function renderpage(){
    let a=localStorage.getItem('nooffriends');
    let b= localStorage.getItem('namesadded');
    //if both nooffriends and namesadded or either is null means they don't exit means the user hasn't interacted at all so we need not to do anything at all
    if((a===null) || (b===null))
            {
               return;
            }
    // if nooffriends is not null means we are entring the names ,and if namesadded is < total friends , we need to add rest of the names , this is for that 
    else if(a!==null && b<a)
        {
            
            document.getElementById('how-many-friends').style.display='none'; //since at this moment we are entring the names we don't need the how-many-friends form 
            document.getElementById('take-names-entry-div').style.display='block'; //but we need the name entring form
            // this below is to render the pages that have been already added 
            let totaladdednames= parseInt(localStorage.getItem('namesadded'));
            for(let i=0;i<totaladdednames;i++){
                rendertopage(localStorage.getItem(i));
            }
            localStorage.setItem('namesadded',totaladdednames);//this line might be unnecessary as i didnot check if the refreshing of page causes the namesadded to be unset , so we set it equal to the names that have already been entered
            document.getElementById('friendnumber').innerText=totaladdednames+1;//span which shows which friend number is to be added next is updated here
        } 

    //this the case where all the names have already been added
    else if(a===b)
    {
        //first we want both friendsize form and name entry form to hide
        document.getElementById('how-many-friends').style.display='none';
        document.getElementById('take-names-entry-div').style.display='none';

        //this removes the names that we rendered to the page , so that the next time we add new names the previous ones are still not there
        document.querySelectorAll('.name-para-divs').forEach(div=>{ div.remove();})
        //this below is show the final page where we add new entries and calculate the final result 
        document.getElementById('reset-all-after-all-name-added').classList.remove('hidden');
        //ofcourse we will need to render the dropdown , because it will be gone if we refresh the page otherwise 
        renderdropdown();
       
        //used this if to make sure that once a calculation is done , it stay on the page even after refresh 
        if(localStorage.getItem('calculatedonce')==='true')
            finalcalculation();

        alert(`${a} names already added `);
        


    } 
}       





//this function is to render the dropdowm of who paid 
function renderdropdown(){
    let namesadded=parseInt(localStorage.getItem('namesadded'));//need a size ,how many to be add in drop down , don't want to run short or go too much 
    for(let i=0;i<namesadded;i++)
        {
            let newoption = document.createElement('option'); //created a option element to be put inside a select which is basically the drop down 
            newoption.value=i; //set the value of newoption to i so that it will be easier to retrive the value of who paid
            let temp=localStorage.getItem(i);//this is what i am talking above ,we used i directly to retrive the name and use it in dropdown
            temp=temp.substring(0, 1).toUpperCase() + temp.substring(1);//to make the first letter of options in dropdown uppercased
            newoption.innerText=temp; 
            document.getElementById('drop-down-for-payee').appendChild(newoption); //added the child to dropdown options
        }

    // we are going to use this same function to render the checkboxes or names to know among who is the amount was shared , so that i don't have to update too much code , where this new rendering gets called
    for(let i=0;i<namesadded;i++)
        {
            let name=localStorage.getItem(i); //get all the names one by one
            let newdiv = document.createElement('div');//create new element to each name
            newdiv.classList.add('flex','items-centre','my-2','pl-3')//adding classes to the newdiv to apply css to them
            newdiv.innerHTML=`<label class='text-lg first-letter:uppercase' for="${i}">${name}</label>
            <input id="name${i}" class="h-5 w-5 ml-3 " type="checkbox">`;//adding lable and checkbox to the new div or say adding the html 
            document.getElementById('parent-checkbox-div').appendChild(newdiv);//added the new name to the page
        }
}





// this function basically gets called when the selectall checkbox is changed
function selectall(){
    
    //getting the refernce the selectall checkbox to check if its checked or not
    let selectall=document.getElementById('selectallcheckbox');
    //getting the size of namesadded to know how many checkboxes need to be checked if selectall is  selected
    let temp=parseInt(localStorage.getItem('namesadded'));
    
    //if the selectall checkbox is selected all other checkboxes are all selected using a for loop other wise all other are unselected
    if(selectall.checked===true){
      
        for(let i=0;i<temp;i++)
            {
                let name="name"+i;//this is because each checkbox was given a dynamic id to get a refernce and it was (name + key of the name in local storage) 
                document.getElementById(name).checked=true; //checking the checkbox with id namei eg. mohit0
                
            }
    }
    else{
        
        for(let i=0;i<temp;i++)
            {
                let name="name"+i;
                document.getElementById(name).checked=false;
                
            }
    }
}





//this function is called when make entry button is clicked , what this function do is that it add the entry of expense to the local storage
function makeentry(){
    //all the data that we get in one entry is stored at one index of payments array as a object , so it will be easier for us to go through each entry
    let amount=parseInt(document.getElementById('amountpaid').value); //retriving the value of amount paid
    
    //we don't want to run the code any further unnecessarily if the amount is not added , use isNaN here becuase it check both if it is empty or not a number, the amount==='' won't work well
    if(isNaN(amount))
        {
            alert("Amount section can't be empty");
            return;
        }
    //added another condition to make sure user don't input -ve amount , well you basically can never pay in -ve so.
    else if(amount<0)
        {
            alert("Amount can't be negative");
            document.getElementById('amountpaid').value='';
            return;
        }
    else
    {
        const whopaid=document.getElementById('drop-down-for-payee').value;//this will retrive the person no. who paid
    
    //we created a array to store who is the amount shared among
    let sharedamong=[];
    //if selectall checkbox is ticked means it is shared amoung all so we store all friend number in sharedamoung array
    if(document.getElementById('selectallcheckbox').checked)
        {
            let temp=parseInt(localStorage.getItem('namesadded'));//gives total no. of friends there are
            for(let i=0;i<temp;i++)
                sharedamong.push(i);
        }
    else
        {   //if selectall is not checked we want to check each checkbox for being checked ,if it is we store the no. to sharedamong
            let temp=parseInt(localStorage.getItem('namesadded'));
            for(let i=0;i<temp;i++)
                {
                    if(document.getElementById(`name${i}`).checked)//names${i} gives us the id of each checkbox one by one
                        sharedamong.push(i);
                }
        } 
    //this if is to make sure the condition when no checkbox is ticked , then the payee is one who shared it to himself ,so we push his no. in the shared among     
    if(sharedamong[0]===undefined)
        {
            sharedamong.push(whopaid);
        }
    let entrynumber=parseInt(localStorage.getItem('entriesmade'))+1;//here at the start entriesmade is zero so we add one to it and use that as the entry no for this transaction and then later update entriesmade to entrynumber so we keep increasing the entry no each time
    let payments=JSON.parse(localStorage.getItem('payments'));//payments is a array but stored as json string so we convert it back 
// let thisentry='entry'+entrynumber;//each entry that we want to store in the payments array we want to store it as a object so we need a key , this is the making of the key entry1 , entry2 etc.

    //here we created the object for present entry where we store the amount , whopaid , whosharedit , and also entryno. so that we can go through each one by one
    let thisentry={
        'amount':amount,
        'whopaid':whopaid,
        'sharedamong':sharedamong,
        'entrynumber':entrynumber
    };
  
    payments.push(thisentry);//we used push function of the array so we don't have to keep track where the entry is going in payments array , it will automatically be added in the last
    localStorage.setItem('payments',JSON.stringify(payments));//stored the array back to the local storage
    localStorage.setItem('entriesmade',entrynumber);//this is where we update the total no. of entries made till now


    //this all code below is to clear the field to make new entries ,so user don't have to clear them manually
    document.getElementById('amountpaid').value='';
    let temp=parseInt(localStorage.getItem('namesadded'));
    document.getElementById('selectallcheckbox').checked=false;
    for(let i=0;i<temp;i++)
        {
            document.getElementById(`name${i}`).checked=false;
                
        }

    //this below section is to show a popup notification entry has been made by making a element unhide and then hide again after  1sec
   
    let newdiv = document.getElementById('popup-entry-made');
    newdiv.classList.remove('hidden');
    setTimeout(() => {
        newdiv.classList.add('hidden');
        }, 1000);
    }

    

    

    
}







//this is the final function which calculates the amount each need to pay or get and show it on the page 
function finalcalculation(){
   
    localStorage.setItem('calculatedonce',true);//this is to mark that the calculation has been done once , so while rendering the page on refresh we can decide if the previous results should be rendered or not
    document.getElementById('final-calculated-result').innerHTML="";//first we remove the previously added result 

    let payments=JSON.parse(localStorage.getItem('payments'));//we retrive the array which have all the entries and parse it from json string to back normality
    
    let totalentries=parseInt(localStorage.getItem('entriesmade')); //this will be useful as we will want to traverse through all the entries we have made so far

    // in case some user clicks the calculate button without making entries , we need to return and do nothing
    if(payments[0]===undefined)
        {   
            alert('you need to make entries first !!');
            return;
        }   
    
    //this is the array which will have entries of objects for each person , and that object will contain how much he paid in total, how much expense he made, and what is his share in total expense
    let arr=[];
    //storing the required object at each index where index no. is equal to the person no.
    for(let i=0;i<localStorage.getItem('namesadded');i++)
        {
            arr[i]={sumpaid:0,
                expensemade:0,
                finalpay:0
            };
        }
   
   
    //we go through all the entries of payments one by one retrive who paid and how much , and add that amount to that person object in arr array
    for(let i=0;i<totalentries;i++)
        {
            arr[parseInt(payments[i].whopaid)].sumpaid+=payments[i].amount;
            //parseInt(payments[i].whopaid) will give us the no. who paid and we will use it as index in arr and update sumpaid by adding the amount of entry to the who paid person in arr
            // we will do this for all entries so by the end of this loop we know who paid how much
        }

    //this loop is a little complicated, we get the amount paid divide it with the no. of people who shared and we have the expense of each person , now we add that amount to the expense of each person who shared the expenses
    for(let i=0;i<totalentries;i++)//we want to go through all the entries
    {
        let sharingsize=payments[i].sharedamong.length;//this gives us the no.of people who shared the expense
        let eachoneexpense=payments[i].amount/sharingsize; //this calculates the expense of one person of particular entry at a time

        for(let j=0;j<sharingsize;j++)//we want to add one-person expense to each person who shared the expense ,so we run the loop as long as the no of expense sharing people are there
        {
            arr[payments[i].sharedamong[j]].expensemade += eachoneexpense;//we update the expense of each person 
            //payments[i].sharedamong[j] will give us the person no. of all people who shared expense one by one , we then use that no. as index and update expensemade in arr or each person 
        }
    }
    console.log('these below are payments and arr array for developers understanding of the code');
    console.log(payments);//this basically loads the payments array and arr array to the console for you to understand the structure , how things are working
    console.log(arr);
    
    for(let i=0;i<arr.length;i++)//this loop is working on the arr array completely as at this it have all the calculated needed
        {
            arr[i].finalpay= Math.round(( arr[i].sumpaid - arr[i].expensemade)*100)/100;//this basically subtracts the expense made by a person from amount he paid to know if he need to pay or get payed from others
            let newdiv =document.createElement('div');//making a new div element for each person to write his final calculation
            if(arr[i].finalpay<0) //if the final calculation of the person is negative means he needs to pay 
            {
                newdiv.innerHTML=`<p class="my-2 font-semibold text-red-800" ><span class="text-black first-letter:uppercase">${localStorage.getItem(i)}</span> needs to Pay ${-1*(arr[i].finalpay)}</p>`;//here multiplied by -1 because i don't want the result to look like "x need to pay -50" it don't go with the statement
            }    
            else if(arr[i].finalpay>0)//if the final calculation of the person is positive means he needs to be paid
            {
                newdiv.innerHTML=`<p class="my-2 font-semibold text-green-700"><span class="text-black first-letter:uppercase">${localStorage.getItem(i)}</span> needs to be Payed ${arr[i].finalpay}</p>`;
            }
            else //is someone don't need to pay or needs to be paid , means his balance is clear 
            {
                newdiv.innerHTML=`<p class="my-2">${localStorage.getItem(i)}'s balance is clear </p>`;
            }

            document.getElementById('final-calculated-result').appendChild(newdiv);//finally adding the result of person on the page
        }

        
        document.getElementById('final-calculated-result').classList.remove('hidden'); //the div was hidden because it was visible because of color difference and had to unhide it
     
}
         
                    













