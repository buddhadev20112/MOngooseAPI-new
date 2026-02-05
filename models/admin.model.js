 const mongoose=require("mongoose");
 const adminSchema = mongoose.Schema({
 name :{
             type:String,
             required:true,
             validate:{
                validator:(nameValue)=>{
                  return /^[A-Za-z ]{3,100}$/.test(nameValue);
                },
                message:"Name can't contains number , only letters min 3 to max 100chars long"
             }
      } ,
      email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:(emailValue)=>{
               return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

            },
            message:'Invalid Email address',
        }
      },
      phone:{
           type:String,
           required:true,
           unique:true,
           validate:{
            validator:(phoneValue)=>{
                return  /^[6-9]\d{9}$/.test(phoneValue);
                 
            },
            message:"Invalid Indian Mobile number",
           }
      },
      pass1:{
        type:String,
        required:true,
        validate:{
            validator:(passValue)=>{
               return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/.test(passValue);

            },
            message :"Password should contains min one UpperCase|LowerCase|Digit|Spl Chars|min 8 to max 16 chars long",
        }
      },
       hashPass1:{
           type:String,
           required:false
      },
       role: {
    type: String,
    enum: [ "admin"],
    default: "admin",
  },
},{versionKey:false});
module.exports = mongoose.model("Admin", adminSchema);