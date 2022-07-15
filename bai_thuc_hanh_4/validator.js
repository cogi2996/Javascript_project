const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


/* tạo ra các rules function bên trong validatorRules object */
let validatorRules = {
    required (value){
        if(value){
            return undefined;
        }
        else{
            return 'Bạn chưa nhập trường này'
        }
    },

    email (value){
        const regExMail =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(regExMail.test(value)) {
            return undefined;
        }
        else{
            return 'Vui lòng nhập đúng định dạng email'
        }
    },

    password (value){
        const regExPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if(regExPassword.test(value)){
            return undefined;
        }
        else{
            return 'Mật khẩu phải từ 7 đến 15 ký tự và có chứa ít nhât một chữ số và ký tự đặc biệt'
        }
    },

    password_confirmation (value){
        const passwordField = $('#password');
        const passwordValue = passwordField.value;
        if(value.trim() && value === passwordValue){
            return undefined;
        }
       
        else{
            return 'Mật khẩu xác nhận không khớp, vui lòng nhập lại'
        }
    },

    check(value){
        if(value){
            return undefined;
        }
        else{
            return 'Bạn chưa chọn trường này'
        }
    }
};
/************Gọi hàm Validator và truyền vào selector của form********* */
let registerForm =new Validator('#register__form');
registerForm.pressSubmit = function(data){
    console.log(data);
}

let loginForm = new Validator('#login__form');
loginForm.pressSubmit = function(data){
    console.log(data);
}


/**********tạo hàm validator với argument is selector of form */

function Validator(formSelector) {
    // lúc này, this chính là Validator
    // _this được sao chép địa chỉ của this nên sẽ trỏ đến Validator
    let _this = this;


    //8. Build getParentElement function
    // giúp tìm kiếm phần tử cha, đứng từ phần tử con
    // logic: điều kiện lặp: currentElement.parentElement tồn tại (có element cha bao ngoài)
    function getParentElement(currentElement,selectorFind) {
        while(currentElement.parentElement){
            // nếu thằng cha có selector trùng với selectorFind thì sẽ 
            // return về phần tử cha bao ngoài đó
            if(currentElement.parentElement.matches(selectorFind)){
                return currentElement.parentElement;
            }
            // nếu không thì nó gán nó = bố nó và tiếp tục nổi ra ngoài để tìm kiểm
            else{
                currentElement = currentElement.parentElement;
            }
        }
    }


    // lấy ra form DOM HTML theo formSelector truyền vào

    const formElement = $(formSelector);

    //4. Tạo formRules là 1 object với mục đích lưu trữ 
    // tất cả các key là tên của input, và mỗi key chứa các function rules
    // của mỗi input 
    let formRules = {}; 


    // nếu xác định được form theo selector
    if(formElement){
        //1. lấy ra all input có attribute là đồng thời là name và rules

        let inputs = formElement.querySelectorAll('[name][rules]');
        let inputsArr = Array.from(inputs);         // => parse to array 
                        // console.log(inputsArr);



        // 2. lặp qua các input field, attribute rules có giá trị là
        // tên các rules cách nhau bởi kí tự | nên phải tách bằng split 
        
        inputsArr.forEach(function(input){

            let rulesOfInput = input.getAttribute('rules');
            //      => lấy giá trị của attribute rules 

            let rules = rulesOfInput.split('|');
            //      => rules là array chứa tên các rule của 1 input 

            
            //3. duyệt qua rule name của 1 input 
            rules.forEach( (rule) =>{

                //5. đang lặp qua input 
                // validatorRules là object chứa all rules function được định nghĩa 
                // input.name: truy cập lấy tên của input 
                // formRules[input.name]: truy cập object formRules với key là tên của input
                
                // logic: nếu là array thì push thêm function rule vào
                // nếu không phải array thì nhảy đến case else, đặt nó thành array với phần tử đầu tiên là function rule đầu 
                // sau đó nhảy đến case if, và push thêm vào, ta được array chứa các rule function
                
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(validatorRules[rule])
                }
                else{
                    formRules[input.name] = [validatorRules[rule]]
                }

            } );


            //6. build event mỗi khi blur ra khỏi 1 input field
            // nên nó phải nằm trong vòng lặp input field
            input.addEventListener('blur',handleValidate);

            // 8. build event input tạm xoá errorMessage khi đang nhập 
            input.addEventListener('input',handleConfirmError);

        });
        // console.log(formRules);
        // kiểm tra xem formRules object chứa các key trùng với name (tên) của các input field
        // giá trị của key là array, array chứa các rule function của mỗi input field



            //7. handleValidate được build bên trong hàm Validator
            // mỗi khi blur event ở 1 input, thì cần xác định được function rule của mỗi input 
        
            function handleValidate(event){
                //      => rulesOfInput là array chứa function rule của mỗi input
                const ruleOfInput = formRules[event.target.name];
                let errorMessage;
        
                // lặp qua rulesOfInput

                for(let i = 0 ; i < ruleOfInput.length; i++){
                    // đang lặp qua các input field 
                    let formGroup = getParentElement(event.target,'.form-group');
                    switch(event.target.type){

                        // input có type là radio
                        case 'radio':
                        
                           // ruleOfInput là array chứa các rule function của mỗi input
                           //tại rule[i] thì tham số truyền vào 
                           // là những input có attribute là gender và được checked
                           // nếu đã được check thì errorMessage = undefined (không báo lỗi)
                           // nếu chưa thì errorMessage = lỗi
                           
                            errorMessage = ruleOfInput[i](formGroup.querySelector('input[name="gender"]:checked'))
                        break;

                        case 'checkbox':
                            // let formGroup = getParentElement(event.target,'.form-group');
                            errorMessage = ruleOfInput[i](formGroup.querySelector('input[name="interest"]:checked'))
                            break;

                        // mặc định thì errorMessage sẽ bằng rule function truyền vào là giá trị check
                        default:
                            errorMessage = ruleOfInput[i](event.target.value);
                    }

                    if(errorMessage){
                        break;
                    }
                }
        
                //  xử lý báo lỗi
                const formGroup = getParentElement(event.target,'.form-group');
                const errorElement = formGroup.querySelector('.form-message');
                        // => nếu tìm thấy formGroup : phần tử cha báo lỗi
                if(formGroup){
                        // => nếu có lỗi
                    if(errorMessage){
                        formGroup.classList.add('invalid');
                        errorElement.textContent = errorMessage;
                    }
                    else{
                        formGroup.classList.remove('invalid');
                        errorElement.textContent = "";
                    }
                }
        
                return Boolean(errorMessage);
                // nếu có lỗi : true 
                // nếu không có lỗi: false
            };
        
            // 10. handleConfirmError được build trong Validator nhằm báo lỗi
            // mỗi khi nhập thì sẽ tạm ẩn lỗi
        
            function handleConfirmError(event){
                const formGroup = getParentElement(event.target,'.form-group');
                const errorElement = formGroup.querySelector('.form-message');
        
                if(formGroup){
                    if(formGroup.classList.contains('invalid')){
                        formGroup.classList.remove('invalid');
                        errorElement.textContent ="";
                    }
                }
            }
        
            // 11. xử lý sự kiện submit form với hành vi mặc định 
        
            formElement.addEventListener('submit', function(event){
                event.preventDefault();
        
                let isValid = true;
                // console.log(inputsArr);
                // lặp qua từng input field

                inputsArr.forEach( (input) =>{
                    // handleValidate bắt được sự kiện event là 1 object 
                    // ta tự tạo ra một object với key là target trỏ tới input vừa chạy qua 
                    let resultValid = handleValidate({target: input});
                    //  ==> nhận được boolean của errorMessage
                    // true : có lỗi
                    // false : không lỗi 


                    // nếu có lỗi thì sửa isValid = false
                    // không lỗi thì isValid = true
                    if(resultValid){
                        isValid = false;
                    }
                } );

                // nếu không có lỗi
                if(isValid){

                    if(typeof _this.pressSubmit === 'function'){

                        // lấy ra all selector có attribute là name, và không bị disabled
                        let enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                        // convert to array : chứa các input
                        let formValuesArr = Array.from(enableInputs);
    
                        // formValues được trả về là 1 object chứa giá trị của all trường nhập vào
                        let formValues = formValuesArr.reduce( (values, input)=>{

                            // đang lặp qua all input trong form
                            // điều kiện kiểm tra là loại input 
                            switch(input.type){
                                case 'file':
                                    values[input.name] = input.files;
                                    break;
                                    
                                    // input nào có type là radio
                                    // nếu nó đã được checked thì lưu lại vào
                                    // key trùng với tên input, giá trị được lưu là input.name
                                case 'radio':
                                    if(input.matches(':checked')){
                                        values[input.name] = input.value;
                                    }
                                    break;

                                case 'checkbox':
                                    // kiểm tra input có type là checkbox 
                                    // kiểm tra key input.name của values có phải là array không 
                                    // nếu không phải thì khai báo key với giá trị là một array rỗng
                                    if (!Array.isArray(values[input.name])) 
                                    {
                                        values[input.name] = [];
                                    }
                                    // nếu thằng nào được checked thì sẽ push giá trị của input đó 
                                    // vào array vừa tạo
                                    if (input.matches(':checked'))
                                    {
                                        values[input.name].push(input.value);
                                    }
                                    break;
                                    
                                default:
                                     // định nghĩa key input.name với giá trị là input.value, giá trị nhập vào
                                    values[input.name] = input.value;
                            }
                            return values;
                        }, {})
                        // cuối cùng là trả về values, là object chứa giá trị theo key là tên của input ;
                        // và gán cho formValues

                        // gán rồi ra lấy _this.pressSubmit để in ra 
                        _this.pressSubmit(formValues);
                    }
                }
            });

            
        }
    };

    
    