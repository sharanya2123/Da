// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
    state = {
        apiStatus: apiStatusConstants.initial,
        vaccinationData: {},
    }

    componentDidMount() {
        this.getVaccinationData()
    }

    getVaccinationData = async () => {
        this.setState({
            apiStatus: apiStatusConstants.inProgress,
        })

        const covidVaccinationDataApiUrl =
         'https://apis.ccbp.in/covid-vaccination-data'

         const response = await fetch(covidVaccinationDataApiUrl)
         if (response.ok === true) {
          const fetchedData = await response.json()
          const updatedData = {
                last7DaysVaccination: fetchedData.last_7_Days_Vaccination.map(
                    eachDayData => ({
                        vaccineDate: eachDayData.vaccine_date,
                        dose1: eachDayData.dose_1,
                        dose2: eachDayData.dose_2,
                    }),
                ),
                VaccinationByAge: fetchedData.vaccination_by_age.map(range => ({
                    age: range.age,
                    count: range.count,
                })),
                VaccinationByGender: fetchedData.vaccination_by_gender.map(
                    genderType => ({
                      gender: genderType.gender,
                      count: genderType.count,
                    }),
                ),
            }
            this.setState({
                vaccinationData: updatedData,
                apiStatus: apiStatusConstants.success,
            })
          }else {
            this.setState({apiStatus: apiStatusConstants.failure})
         }
    }

    renderFailureView = () => (
        <div className="fsilure-view">
          <img className="failure-image"
               src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
               alt="failure view"
            />
            <h1 className="failure-text">Something went wrong</h1>        
            </div>
    )

    renderVaccinationStatus = () => {
        const {vaccinationData} = this.state 

        return (
          <>
            <VaccinationCoverage
              vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
            />
            <VaccinationByGender
              vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
            />
            <VaccinationByAge
              vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
            />
          </>
        )
    }

    renderLoadingView = () => (
        <div className="loading-view" data-testid="loader">
          <Loader color="#fff" height={80} type="THreeDots" width={80} />
        </div>
    )

    renderViewsBasedOnAPIStatus = () => {
        const {apiStatus} = this.state 

        switch (apiStatus) {
            case apiStatusConstants.success:
              return this.renderVaccinationStatus()
            case apiStatusConstants.failure:
              return this.renderFailureView()
            case apiStatusConstants.inProgress:
              return this.renderLoadingView()
            default:
              return null
    } 

}

render() {
    return (
        <div className="app-container">
          <div className="cowin-dashboard-container">
           <div className="logo-container">
            <img src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png" 
                 alt="website logo"
                 className="logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
           </div>
           <h1 className="heading">Cowin Vaccination in India</h1>
             {this.renderViewsBasedOnAPIStatus()}
          </div>
         </div>
    )
  }
}

export default CowinDashboard