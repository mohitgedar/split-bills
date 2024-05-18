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
        <p class=" text-lg my-1
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
    if((a===null) || (b===null))
            {
               
                return;
            }
    else if(a!==null && b<a)
        {
            
            document.getElementById('how-many-friends').style.display='none';
            document.getElementById('take-names-entry-div').style.display='block';
            let totaladdednames= parseInt(localStorage.getItem('namesadded'));
            for(let i=0;i<totaladdednames;i++){
                rendertopage(localStorage.getItem(i));
            }
            localStorage.setItem('namesadded',totaladdednames);
            document.getElementById('friendnumber').innerText=totaladdednames+1;
        } 

    else if(a===b)
    {
        
        document.getElementById('how-many-friends').style.display='none';
        document.getElementById('take-names-entry-div').style.display='none';
        document.querySelectorAll('.name-para-divs').forEach(div=>{ div.remove();})
        document.getElementById('reset-all-after-all-name-added').classList.remove('hidden');
        renderdropdown();
       
        if(localStorage.getItem('calculatedonce')==='true')
            finalcalculation();

        alert(`${a} names already added `);
        


    } 
}       






function renderdropdown(){
    let namesadded=parseInt(localStorage.getItem('namesadded'));
    for(let i=0;i<namesadded;i++)
        {
            let newoption = document.createElement('option');
            newoption.value=i;
            newoption.innerText=localStorage.getItem(i);
            document.getElementById('drop-down-for-payee').appendChild(newoption);
        }

    // we are going to use this same function to render the checkboxes , so that i don't have to update too much code , where this new rendering gets called
    for(let i=0;i<namesadded;i++)
        {
            let name=localStorage.getItem(i);
            let newdiv = document.createElement('div');
            newdiv.classList.add('flex','items-centre','my-2')
            newdiv.innerHTML=`<label class='text-lg' for="${i}">${name}</label>
            <input id="name${i}" class="h-5 w-5 ml-3 " type="checkbox">`;
            document.getElementById('parent-checkbox-div').appendChild(newdiv);
        }
}






function selectall(){
    
    let selectall=document.getElementById('selectallcheckbox');
    let temp=parseInt(localStorage.getItem('namesadded'));
    
    if(selectall.checked===true){
      
        for(let i=0;i<temp;i++)
            {
                let name="name"+i;
                document.getElementById(name).checked=true;
                
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






function makeentry(){
    let amount=parseInt(document.getElementById('amountpaid').value);
    
    if(amount==='')
        {
            alert("Amount section can't be empty");
            return;
        }

    const whopaid=document.getElementById('drop-down-for-payee').value;//this will me the person no. who paid
    
    let sharedamong=[];
    if(document.getElementById('selectallcheckbox').checked)
        {
            let temp=parseInt(localStorage.getItem('namesadded'));
            for(let i=0;i<temp;i++)
                sharedamong.push(i);
        }
    else
        {
            let temp=parseInt(localStorage.getItem('namesadded'));
            for(let i=0;i<temp;i++)
                {
                    if(document.getElementById(`name${i}`).checked)
                        sharedamong.push(i);
                }
        }  
    if(sharedamong[0]===undefined)
        {
            sharedamong.push(whopaid);
        }
    let entrynumber=parseInt(localStorage.getItem('entriesmade'))+1;
    let payments=JSON.parse(localStorage.getItem('payments'));
    let thisentry='entry'+entrynumber;
    thisentry={
        'amount':amount,
        'whopaid':whopaid,
        'sharedamong':sharedamong,
        'entrynumber':entrynumber
    };
  
    payments.push(thisentry);
    localStorage.setItem('payments',JSON.stringify(payments));
    localStorage.setItem('entriesmade',entrynumber);

    document.getElementById('amountpaid').value='';
    let temp=parseInt(localStorage.getItem('namesadded'));
    document.getElementById('selectallcheckbox').checked=false;
    for(let i=0;i<temp;i++)
        {
            document.getElementById(`name${i}`).checked=false;
                
        }
}








function finalcalculation(){
    localStorage.setItem('calculatedonce',true);
    document.getElementById('final-calculated-result').innerHTML="";

    let payments=JSON.parse(localStorage.getItem('payments'));
    
    let totalentries=parseInt(localStorage.getItem('entriesmade'));
    // in case some user clicks the calculate button without making entries
    if(payments[0]===undefined)
        {   
            alert('you need to make entries first !!');
            return;
        }   

    let arr=[];
    for(let i=0;i<localStorage.getItem('namesadded');i++)
        {
            arr[i]={sumpaid:0,
                expensemade:0,
                finalpay:0
            };
        }
   
   
    for(let i=0;i<totalentries;i++)
        {
            arr[parseInt(payments[i].whopaid)].sumpaid+=payments[i].amount;
        }

    for(let i=0;i<totalentries;i++)
    {
        let sharingsize=payments[i].sharedamong.length;
        let eachoneexpense=payments[i].amount/sharingsize;
        for(let j=0;j<sharingsize;j++){
            arr[payments[i].sharedamong[j]].expensemade += eachoneexpense;
        }
    }
    console.log(payments);
    console.log(arr);
    
    for(let i=0;i<arr.length;i++)
        {
            arr[i].finalpay= Math.round( arr[i].sumpaid - arr[i].expensemade);
            let newdiv =document.createElement('div');
            if(arr[i].finalpay<0)
            {
                newdiv.innerHTML=`<p class="my-2" >${localStorage.getItem(i)} needs to pay ${-1*(arr[i].finalpay)}</p>`;
            }    
            else if(arr[i].finalpay>0)
            {
                newdiv.innerHTML=`<p class="my-2">${localStorage.getItem(i)} needs to be payed ${arr[i].finalpay}</p>`;
            }
            else
            {
                newdiv.innerHTML=`<p class="my-2">${localStorage.getItem(i)}'s balance is clear </p>`;
            }

            document.getElementById('final-calculated-result').appendChild(newdiv);
        }

        

     
}
         
                    













