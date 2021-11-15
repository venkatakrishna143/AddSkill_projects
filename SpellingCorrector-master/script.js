//Global variables
var data_about_words;

//function for displaying the text of file 
function displaytext(){
//Selecting the file      
var fileToLoad = document.getElementById("formFile").files[0];
console.log(fileToLoad);

//Creating file reader object for reading
var fileReader = new FileReader();

  fileReader.onload = function(fileLoadedEvent){
      //Getting the total content of file
      var textFromFileLoaded = fileLoadedEvent.target.result;
      //Splitting the content into array of words
      var arr_words=textFromFileLoaded.split(" ");

      //global functionvariables
      var innerhtmlbx="";
      var i;
      var words='';

      
      //adding each words with + as separater so that it can be appended into url string
      for(i=0;i<arr_words.length;i++){
        if(i===0){
          words=words+arr_words[i];
        }
        else{
          words=words+'+'+arr_words[i]
        }   
         
      }

      //constructed url for making request
      var url='https://api.textgears.com/spelling?key=AQq2kJmFj129bCFC&text='+words+'&language=en-GB' 
      
      //fetching the response of url using promise
      console.log("b fetchdata");

      //Calling fetchdata async function which will return promise but it will return only after response data has been fetched as await keyword is used before fetch
      fetchdata(url).then((response) => {
        console.log("printing response"+response)
        console.log('in after getting response');
        //converting response in json format
  return response.json();
}).then(data => {
   //data varibale contain the response in json object form
  //string array of error word as well as their suggestion in global varibale
  //assinging fetched data to global varibale data_about_words so that it will be available while we need data for showing suggesstion in  popup or dropdown
 data_about_words=data["response"]["errors"];
 console.log(typeof(data_about_words));
 console.log(data_about_words)
 console.log(data_about_words.length) 
      
      //Looping so that we can check if a word is having speeling mistake and hence append innerhtml related to that in div in which we show content of file.
      for( var j=0;j<arr_words.length;j++){
        var flag=0;
        for(var k=0;k<data.response.errors.length;k++){
          
           console.log('printglobal data inside double for'+data_about_words);
          //checking if the word is presnet in response.if it is present then it is misspelled word
          if(arr_words[j]===data.response.errors[k].bad){
            flag=1;
            break;
          }
        }
        if(flag===1){
          //adding dropdown and suggesstion(correct words) with the span tag of  misspelled word 
          var options=provide_correct_options(arr_words[j]);
          var liststring='';
          for(var z=0;z<options.length;z++){
             liststring=liststring+'<li><a class="dropdown-item" id="'+options[z]+'" href="#">'+options[z]+'</a></li>'
             console.log(options[z]);
             const ne=options[z];
             console.log("here"+typeof ne)
             console.log(document.getElementById(ne));
          }  

          
          var b='<span class="dropdown"><a class="bg-danger dropdown-toggle" href="#" role="button" id="'+arr_words[j]+'" data-bs-toggle="dropdown" aria-expanded="false">'+arr_words[j]+'</a><ul class="dropdown-menu" aria-labelledby="'+arr_words[j]+'">'+liststring+'</ul></span>';
        
          innerhtmlbx=innerhtmlbx+b;
        }
        else{
          //for correct word just adding normal span
          innerhtmlbx=innerhtmlbx+'<span>'+arr_words[j]+'</span> '
        }
      }
      //adding the innerhtml into the div for displaying text
      document.getElementById("text-display").innerHTML=innerhtmlbx;
      console.log(data_about_words);
      //adding onclick listener to every coorect words suggessted fot misspelled words
      for(var outer=0;outer<data_about_words.length;outer++){
        for(var inner=0;inner<data_about_words[outer].better.length;inner++){
          console.log("inside assinging event");
          console.log(data_about_words[outer]['bad']);
          if(data_about_words[outer].better[inner]!==null && data_about_words[outer]['bad']!==null ){
          document.getElementById(data_about_words[outer].better[inner]).addEventListener("click",changetext.bind(null,event,data_about_words[outer]['bad'],data_about_words[outer].better[inner]) , false);
          }
        }
      }
    
      console.log('printglobal data'+data_about_words);


  /*if(data.response.errors.length!==0){
    console.log(arr_words[i]);
    document.getElementById("text-display").innerHTML = document.getElementById("text-display").innerHTML+'<span class="bg-danger">'+arr_words[i]+'</span> ';
    console.log(document.getElementById("text-display").innerHTML)
  }
  else{
    console.log(arr_words[i]);
     document.getElementById("text-display").innerHTML = document.getElementById("text-display").innerHTML+'<span>'+arr_words[i]+'</span> '
     console.log(document.getElementById("text-display").innerHTML)
  
  }*/
});
        
      
      
      console.log(words);
      console.log(innerhtmlbx);
      
  };
 
  //Reading the file
  fileReader.readAsText(fileToLoad, "UTF-8");
}

//assign function for placing correct words in place of wrong words
function changetext(d,a,b,event) {
             document.getElementById(a).innerHTML=b;
             
             document.getElementById(a).classList.remove('bg-danger');
             document.getElementById(a).classList.add('text-dark');



             

              }

//this function is called for provide list of correct words for given misspelled words.
function provide_correct_options(current){
  //console.log(data_about_words[0]["bad"]);
  
  var options;
  for(var a=0;a<data_about_words.length;a++){
    
    if(data_about_words[a]["bad"]===current){
       options=data_about_words[a]["better"];
       return options;

    }
  }
}

//fetchdata function which will return promise after data is successfullyfetched from api
async function fetchdata(url){
  console.log('in fetchdata');
  var data=await fetch(url);
  console.log('b returning in fetchdata');
  return data;
}


//function validating extension of selected file 
function fileValidation() {
            var fileInput = 
                document.getElementById('formFile');
 
            var filePath = fileInput.value;
          
            // Allowing file type
            var allowedExtensions = 
/(\.txt)$/i;
              
            if (!allowedExtensions.exec(filePath)) {
                alert('Invalid file type');
                fileInput.value = '';
                return false;
            } 
        }