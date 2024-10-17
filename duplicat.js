document.addEventListener("DOMContentLoaded",function(){
  const searchButtom=document.getElementById('search-btn');
  const userNameInput=document.getElementById('user-input');
  const statsContainer=document.querySelector(".stats-container");
  const easyProgressCircle=document.querySelector(".easy-progress");
  const mediumProgressCircle=document.querySelector(".medium-progress");
  const hardProgressCircle=document.querySelector(".hard-progress");
  const easyLabel=document.getElementById("easy-label");
  const mediumLabel=document.getElementById("medium-label");
  const hardLabel=document.getElementById("hard-label");
})
//return true or false base on regular expression
function validateUsername(username){
   if(username.trim()==""){
    alert("username should not be empty");
    return false
   }
   const regex = /^[a-zA-Z0-9_]{4,15}$/;
   const isMatching = regex.test(username);
   if(!isMatching){
    alert("invalid username");
   }
   return isMatching;
}

async function fetchUserDetails(username) {
    //jaise hi detail karte he tsb
    try{
      searchButtom.textContent="Searching...";
      searchButtom.disabled=true;
      //const respone=await fetch(url)
      //creating proxy url server
      const proxyUrl='https://cors-anywhere.herokuapp.com/'
      const targeturl='https://leetcode.com/graphq;/' 
      
      //concatinated url https;//cors-anywhere.herokuapp.com/https;//leetcode.com/graphq;/
      //it will go to demo server , and demo server , unnecessary part hata dega
      const myHeaders=new Headers();
      myHeaders.append("content-type","application/json");

      const graphql=json.stringify({
        //kya chahte he 
        query : "\n query userSessionProgress($username: $string!){\n allQuestionCount {\n difficulty\n}\n matchedUser {username : $username {\n submitStats {\n acSubmissionNum {\n diffculty\n count\n submission\n } \n totalSubmissionNum {\n difficulty\n count\n  submisiions\n } \n }\n}\n } \n ", variables: {"username" : `${username}`}  //kiske liye chahte he 
      })
      const requestOptions={
        method:'post',
        Headers:myHeaders,
        body:graphql,
        redirect:'follow'
      };
      //concating proxu url;
      const respone=await fetch(proxyUrl+targeturl,requestOptions);
      if(!respone.ok){
        throw new error("unable to etch user details");
      }
      const data=await  Response.json();
      console.log("Loggine data : ", data);
    }
    catch(error){
      statsContainer.innerHTML ='<p>no data found</p>'
    }
    finally{
      searchButtom.textContent="search";
      searchButtom.disabled=false; 
    }

  }

searchButtom.addEventListener("click", function(){
  const username=userNameInput.value;
  console.log("logging username", username);
  if(validateUsername(username)){
    fetchUserDetail(username);
  }
})