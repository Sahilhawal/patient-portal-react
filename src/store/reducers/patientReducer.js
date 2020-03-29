const initState = {
  patients: [
    {
      id: "1",
      name: "Dwight Schrute",
      domain: "patient",
      email: "Dwight@office.com",
      age: 20,
      gender: "male",
      date_of_birth: "2020/03/20",
      date_of_last_visit: "2020/03/20",
      symptoms: [{ value: "Cough" }, { value: "Headache" }],
      medicines: [{ meds: "Diphenhydramine" }]
    },
    {
      id: "2",
      name: "James Halpert",
      domain: "patient",
      email: "James@office.com",
      age: 20,
      gender: "male",
      date_of_birth: "2020/03/20",
      date_of_last_visit: "2020/03/20",
      symptoms: [{ value: "Fever" }, { value: "Cold" }],
      medicines: [{ meds: "Crocin" }, { meds: "Vicks" }]
    }
  ]
};

const patientReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_PATIENT":
      return Object.assign({}, state, {
        patients: [...state.patients, action.data]
      });
    case "EDIT_PATIENT":
      let newPatients = state.patients.map(patients =>
        action.data.email === patients.email ? action.data : patients
      );
      return {
        ...state,
        patients: newPatients
      };
    case "DELETE_PATIENT":
      let newState = state.patients.filter(patient => {
        return patient.email !== action.data;
      });
      return {
        ...state,
        patients: newState
      };
    default:
      return state;
  }
};

export default patientReducer;
