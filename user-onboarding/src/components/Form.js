import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';

function AppForm({ errors, touched, values, isSubmitting, status }) {

  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    if(status) {
      setUsers([...users, status]);
    }
  }, [users, status]);

  return (
    <div className="form-container">
      <h1>User Form</h1>
      <Form className="form">
        <Field 
          className="form__field"
          component="input"
          type="text"
          name="name"
          placeholder="Name"
        />

        {touched.name && errors.name && <p className="form__error">{errors.name}</p>}
        <Field 
          className="form__field"
          component="input"
          type="email"
          name="email"
          placeholder="Email"
        />
            {touched.email && errors.email && <p className="form__error">{errors.email}</p>}
        <Field 
          className="form__field"
          component="input"
          type="password"
          name="password"
          placeholder="Password"
        />
        {touched.password && errors.password && <p className="form__error">{errors.password}</p>}
        <label className="form__field__label">
          Accept Terms of Service:
          <Field 
            type="checkbox"
            name="tos"
            checked={values.tos}
          />
        </label>
        {errors.tos && <p className="form__error">{errors.tos}</p>}
        
        <button className="form__btn" disabled={isSubmitting}>Submit</button>
      </Form>
      { users.map( user => {
        return (
          <div className="app__users" key={user.id}>
            <p>ID: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        )
      })}
    </div>
  );
}

const propsToValuesMap = {
  mapPropsToValues({ name, email, password, tos }) {

    return {

      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false
    }
  },
  validationSchema: Yup.object().shape({

    name: Yup.string()
      .required('Please enter your name'),
    email: Yup.string()
      .email('Email is not valid')
      .required('Please enter your email address'),
    password: Yup.string()
      .min(6, 'Password must be 6 characters or longer')
      .required('Please enter a password'),
    tos: Yup.boolean()
      .required()
      .oneOf([true], 'TOS must be accepted')
  }),
  handleSubmit( values, { resetForm, setErrors, setSubmitting, setStatus }) {


    axios.post("https://reqres.in/api/users", values)
      .then( res => {
        console.log(res);
        setStatus(res.data);
        resetForm();
        setSubmitting(false);
      })
      .catch( err => {
        console.log(err);
        setSubmitting(false);
      })
  }
};


export default withFormik(propsToValuesMap)(AppForm);