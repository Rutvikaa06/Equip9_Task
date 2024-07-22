function Validation(values) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    const mobile_pattern = /^\d{10}$/; // Mobile number must be exactly 10 digits
  
    if (values.name === "") {
      errors.name = "Name should not be empty";
    }
  
    if (values.mobile === "") {
      errors.mobile = "Mobile number should not be empty";
    } else if (!mobile_pattern.test(values.mobile)) {
      errors.mobile = "Mobile number must be exactly 10 digits";
    }
  
    if (values.password === "") {
      errors.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
      errors.password = "Password didn't match";
    }
  
    return errors;
  }
  
  export default Validation;
  