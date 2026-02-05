//loading the openai lib.
const { default: OpenAI } = require('openai');
const fs = require('fs');
var openai = require('openai');
const env = require("dotenv").config();
openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
});

async function agent(userInput){
    const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `
You are a very simple AI agent.
User: ${userInput}
`
  });
var output="";
 output = response.output_text;
console.log("AI OUTPUT:\n", output);

 // 🧠 AGENT DECISION
  if (userInput.toLowerCase().includes("save")) {
    const content = userInput.toLowerCase().split("save")[1];
    console.log(content);
    fs.writeFileSync("output.txt", content);
    console.log("✅ File saved as output.txt");
    output= "File saved as output.txt";
      
}else if(userInput.toLowerCase().includes("signup")){
       const name = userInput.match(/name=([^\s]+)/)[1];
       const phone =userInput.match(/phone=([^\s]+)/)[1];
       const email =userInput.match(/email=([^\s]+)/)[1];
       const pass1 = userInput.match(/pass1=([^\s]+)/)[1];
       console.log("name",name,"email",email,"phone",phone,"pass1",pass1);
       return {name,phone,email,pass1};       
}
else if(userInput.toLowerCase().includes("signin") ||
        userInput.toLowerCase().includes("login")
) {
         const email =userInput.match(/email=([^\s]+)/)[1];
         const pass1 = userInput.match(/pass1=([^\s]+)/)[1];
         console.log("email",email);
         console.log("pass1",pass1);
         return {email,pass1};
}
else if(userInput.toLowerCase().includes("all")){
        return "all"; 
}
else if(userInput.toLowerCase().includes("show")||
        userInput.toLowerCase().includes("view")){
             const userid =userInput.match(/id=([^\s]+)/)[1];
             return userid;
            }
    return output;
}

module.exports = agent;
console.log("ChatBot Agent is working");
