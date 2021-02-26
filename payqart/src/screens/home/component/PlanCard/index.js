import React, { Fragment } from 'react'

function PlanCard({ plan, active, changePlan }) {
  return (
    <Fragment>
      <div className="plancard_wrap">
        <label
          className={`shadow ${plan.month === active ? 'active_plan' : ''}`}
        >
          <span>{plan.name}</span>
          <span className="lmd-font pq-bold">{plan.month}</span>
          <span>{plan.month > 1 ? 'Months' : 'Month'}</span>
          <input
            type="radio"
            name="plan"
            value={plan.month}
            checked={plan.month === active ? true : false}
            onChange={(e) => changePlan(e)}
          />
        </label>
      </div>
    </Fragment>
  )
}

export default PlanCard
