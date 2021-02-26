import React, { Fragment, useState } from 'react'
import Seo from '../../shared/Seo'
import { Link } from 'react-router-dom'
import CartCard from './component/CartCard'
import PlanCard from './component/PlanCard'
import { carts, plans } from '../../utils/data'
import { formatMoney, getTotal } from '../../utils/helper'
import { Container, Form } from 'react-bootstrap'

function Home() {
  const [step, setStep] = useState(1)
  const [work, setWork] = useState('Paid Employment')
  const [plan, setPlan] = useState('1')
  const [salary, setSalary] = useState('')
  const [date, setDate] = useState('')
  const [loan, setLoan] = useState('')
  const [err, setErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [credit, setCredit] = useState(null)
  const [downPayment, setDownPayment] = useState('')
  const [loading, setLoading] = useState(false)

  const getShoppingCredit = async (month) => {
    const totalCart = getTotal(carts)
    try {
      setLoading(true)
      const response = await fetch(
        'https://payqart-test-server.herokuapp.com/api/v1/approveCredit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            salary,
            totalCart,
            date,
            existingLoan: loan,
            month: month,
          }),
        },
      )
      const convert = await response.json()
      setLoading(false)
      console.log(response)
      return { error: false, ...convert }
    } catch (error) {
      console.log(error)
      setLoading(false)
      return {
        error: true,
        msg: error.response.data,
      }
    }
  }

  const UpdatePlan = async (e) => {
    setPlan(e.target.value)

    const response = await getShoppingCredit(e.target.value)

    if (!response.error) {
      setCredit(response)
    }

    if (response.error) {
      setErr(true)
      setErrMsg('Please try again error occured')
    }
  }

  const updateDownPayment = async (e) => {
    e.preventDefault()
    if (isNaN(+downPayment)) {
      setErr(true)
      setErrMsg('Please input your downPayment in number')
      return
    }

    const totalCart = getTotal(carts)
    try {
      setLoading(true)
      const response = await fetch(
        'https://payqart-test-server.herokuapp.com/api/v1/updateDownPayment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            totalCart,
            deposit: downPayment,
            month: plan,
          }),
        },
      )
      const convert = await response.json()
      setLoading(false)
      setCredit(convert)
      console.log(response)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErr(true)
      setErrMsg('Please request failed, try again')
    }
  }

  /**
   * callApproval for shopping credit
   * @param {e} event object
   */
  const callApproval = async (e) => {
    e.preventDefault()
    if (isNaN(+salary)) {
      setErr(true)
      setErrMsg('Please input your salary in number')
      return
    }

    if (!date) {
      setErr(true)
      setErrMsg('Please select next pay date')
      return
    }

    if (loan === '') {
      setErr(true)
      setErrMsg('Please select if you have an existing loan')
      return
    }

    const response = await getShoppingCredit(plan)

    if (!response.error) {
      setStep(step + 1)
      setCredit(response)
    }

    if (response.error) {
      setErr(true)
      setErrMsg('Please try again error occured')
    }
  }

  return (
    <Fragment>
      <Seo>
        <main id="main">
          <section className="section_wrapper">
            <div className="first_side">
              <div className="payqart_desc">
                <div>
                  <Link to="#" className="white lmd-font">
                    <i className="fas fa-arrow-left"></i> Back To Store
                  </Link>
                </div>
                <div>
                  <img
                    src="/asset/img/logo.png"
                    alt="Payqart logo"
                    className="logo"
                  />
                </div>
                <div>
                  <ul className="goals">
                    <li className="white">Get pre-approved instantly</li>
                    <li className="white">
                      Spread payment for up to six months
                    </li>
                    <li className="white">
                      Provide some basic information to get started
                    </li>
                  </ul>
                </div>
              </div>
              <div className="order_wrapper bg-ash">
                <h2>ORDER SUMMARY</h2>
                <div className="cart_summary bg-white shadow">
                  {carts.map((e, i) => (
                    <CartCard item={e} key={i} />
                  ))}
                </div>
                <div className="total_cart p-3 bg-white shadow">
                  <p className="pq-slim">Total Cart Value:</p>
                  <p className="pq-bold">
                    &#8358;{formatMoney(getTotal(carts))}
                  </p>
                </div>
              </div>
            </div>
            <div className="second_side">
              <Container>
                <div className="direction">
                  {step === 2 && (
                    <Link
                      to="#"
                      className="light-magenta back_direction"
                      onClick={(e) => setStep(step - 1)}
                    >
                      <i className="fas fa-arrow-left"></i> Back
                    </Link>
                  )}
                  <div className="stepper">
                    <div
                      className={`dot ${
                        step >= 1 ? 'bg-light-magenta' : 'bg-grey'
                      }`}
                    >
                      <span>
                        {step > 1 ? <i className="fas fa-check"></i> : '1'}
                      </span>
                    </div>
                    <div
                      className={`line ${
                        step > 1 ? 'bg-light-magenta' : 'bg-grey'
                      }`}
                    ></div>
                    <div
                      className={`dot ${
                        step >= 2 ? 'bg-light-magenta' : 'bg-grey'
                      }`}
                    >
                      <span>
                        {step > 2 ? <i className="fas fa-check"></i> : '2'}
                      </span>
                    </div>
                    <div className="line bg-grey"></div>
                    <div className="dot bg-grey">
                      <span>3</span>
                    </div>
                    <div className="line bg-grey"></div>
                    <div className="dot bg-grey">
                      <span>4</span>
                    </div>
                  </div>
                </div>
                {step === 1 && (
                  <div>
                    <h2 className="text-center pt-4 magenta">
                      What Do You Do?
                    </h2>
                    <div className="work_categories">
                      <label className="work_card">
                        <div className="work_img shadow bg-white">
                          <img
                            src="/asset/img/paid.svg"
                            alt="Paid Employment"
                          />
                        </div>
                        <input
                          type="radio"
                          value="Paid Employment"
                          name="work"
                          onChange={(e) => setWork(e.target.value)}
                        />
                        <span
                          className={
                            work === 'Paid Employment' ? 'pq-bold' : 'pq-slim'
                          }
                        >
                          Paid Employment
                        </span>
                      </label>
                      <label className="work_card">
                        <div className="work_img shadow bg-white">
                          <img
                            src="/asset/img/self.svg"
                            alt="Self Employed/ Freelance"
                          />
                        </div>
                        <input
                          type="radio"
                          value="Self Employed/ Freelance"
                          name="work"
                          onChange={(e) => setWork(e.target.value)}
                        />
                        <span
                          className={
                            work === 'Self Employed/ Freelance'
                              ? 'pq-bold'
                              : 'pq-slim'
                          }
                        >
                          Self Employed/ Freelance
                        </span>
                      </label>
                      <label className="work_card">
                        <div className="work_img shadow bg-white">
                          <img
                            src="/asset/img/corprate.svg"
                            alt="Corporate Organisation"
                          />
                        </div>
                        <input
                          type="radio"
                          value="Corporate Organisation"
                          onChange={(e) => setWork(e.target.value)}
                          name="work"
                        />
                        <span
                          className={
                            work === 'Corporate Organisation'
                              ? 'pq-bold'
                              : 'pq-slim'
                          }
                        >
                          Corporate Organisation
                        </span>
                      </label>
                    </div>
                    <Form className="preapproval_form" onSubmit={callApproval}>
                      <Form.Group controlId="salary">
                        <Form.Label className="magenta">
                          How much do you get paid monthly?
                        </Form.Label>
                        <div className="join_field bg-white shadow">
                          <div className="bg-magenta form_prepend">
                            <p className=" white lmd-font">&#8358;</p>
                          </div>
                          <Form.Control
                            type="text"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="What is your salary"
                          />
                        </div>
                      </Form.Group>
                      <Form.Group controlId="date">
                        <Form.Label className="magenta">
                          When is your next salary date?
                        </Form.Label>
                        <div className="join_field bg-white shadow">
                          <div className="bg-white form_prepend">
                            <p className=" magenta lmd-font">
                              <span className="far fa-calendar-alt"></span>
                            </p>
                          </div>
                          <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="Salary pay date"
                          />
                        </div>
                      </Form.Group>
                      <Form.Group controlId="date">
                        <Form.Label className="magenta">
                          Do you have any existing loan(s)?
                        </Form.Label>
                        <div className="bg-white shadow loan_status">
                          <label className="radio-container">
                            <input
                              type="radio"
                              name="loan"
                              onChange={(e) => setLoan(true)}
                            />
                            <span className="checkmark"></span> Yes
                          </label>
                          <label className="radio-container">
                            <input
                              type="radio"
                              name="loan"
                              //   checked={true}ß
                              onChange={(e) => setLoan(false)}
                            />
                            <span className="checkmark"></span> No
                          </label>
                        </div>
                        {err && (
                          <p className="text-center magenta mt-2">{errMsg}</p>
                        )}
                      </Form.Group>
                      <button
                        className="btn-default mx-auto mt_3"
                        disabled={loading}
                      >
                        Continue
                      </button>
                    </Form>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <h2 className="text-center pt-4 magenta">
                      Choose Your Plan
                    </h2>
                    <div className="plan_wrapper">
                      {plans.map((e, i) => (
                        <PlanCard
                          key={i}
                          plan={e}
                          active={plan}
                          changePlan={UpdatePlan}
                        />
                      ))}
                    </div>
                    <div>
                      <h2 className="text-center pt-4 magenta">
                        Payment BreakDown
                      </h2>
                      <div className="breakdown_wrap shadow bg-white">
                        <div className="payment_breakdown">
                          <div>
                            <p className="magenta">Shopping Credit</p>
                            <p className="magenta">Down Payment</p>
                            <p className="magenta">Monthly Installment</p>
                            <p className="magenta">Tenure</p>
                          </div>
                          {credit && (
                            <div>
                              <p className="magenta pq-bold">
                                &#8358;{formatMoney(credit?.credit)}
                              </p>
                              <p className="magenta pq-bold">
                                &#8358;{formatMoney(credit?.downPayment)}
                              </p>
                              <p className="magenta pq-bold">
                                &#8358;{formatMoney(credit?.monthlyRepayment)}
                              </p>
                              <p className="magenta pq-bold">{`${
                                credit?.month
                              } ${credit?.month > 1 ? 'months' : 'month'}`}</p>
                            </div>
                          )}
                        </div>
                        <div className="updatedown_payment">
                          <p className="white text-center">
                            Customize <br /> Down Payment
                          </p>
                          <Form onSubmit={updateDownPayment}>
                            <Form.Group controlId="payment">
                              <div className="update_field bg-white shadow">
                                <div className="bg-white form_prepend">
                                  <p className=" magenta lmd-font">&#8358;</p>
                                </div>
                                <Form.Control
                                  type="text"
                                  value={downPayment}
                                  onChange={(e) =>
                                    setDownPayment(e.target.value)
                                  }
                                />
                              </div>
                            </Form.Group>
                            <button
                              className="btn-white xxs-font"
                              disabled={loading}
                            >
                              Update Breakdown
                            </button>
                          </Form>
                        </div>
                      </div>
                    </div>
                    {err && (
                      <p className="text-center magenta mt-2">{errMsg}</p>
                    )}
                    <button className="btn-default mx-auto mt_3">
                      Continue
                    </button>
                  </div>
                )}
              </Container>
            </div>
          </section>
        </main>
      </Seo>
    </Fragment>
  )
}

export default Home
