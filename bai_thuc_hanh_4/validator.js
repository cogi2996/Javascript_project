// Đối tượng `Validator`
function Validator(options) {
    var selectorRules = {};
    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        //value: inputElement.value
        // test: func: rule.test
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage;
        // lấy ra các rules ( là các function con ) của các selector
        var rules = selectorRules[rule.selector];
        // Lặp qua từng rule &&  check đúng sai của nó
        // Nếu có lỗi thì dừng việc kiểm tra 
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }
    // lấy element cửa form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Bỏ qua hành vi mặc định của submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;
            // Lặp qua từng rules và validate luôn
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });
            // 
            if (isFormValid) {
                // Trường hợp submit với js
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        // console.log(values);
                        return (values[input.name] = input.value) && values;
                    }, {})
                    // Trường hợp submit với hành vi mặc định
                    options.onSubmit(formValues);
                }
                else{
                    formElement.submit(); 
                }
            }
        }
        // Lặp qua mỗi rule và xử lí ( lắng nghe sự kiện blur, input...)
        options.rules.forEach(function (rule) {
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            // selectorRules[rule.selector] = rule.test;
            var inputElement = formElement.querySelector(rule.selector);
            // Xử lý trường hợp khi blur ra ngoài
            if (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

// Nguyên tắc của các rules:
// Khi có lỗi --> trả ra message lỗi
// Khi hợp lệ ==> không trả ra cái gì cả  ( undefined )
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        // check xem user đã nhập chưa
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường hợp này'
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        //  check xem user đã nhập email chưa
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường hợp này phải là email ';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
        }
    };
}

Validator.isConfirmed = function (selector, getCofirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getCofirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác '
        }
    }
}