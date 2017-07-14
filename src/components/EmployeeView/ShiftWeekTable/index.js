import React, { Component } from 'react';
import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import JobsRow from './JobsRow';
import SpecialDay from "./SpecialDay";
import jobsData from "./jobs.json";
import '../../Scheduling/style.css';

export default class ShiftWeekTable extends Week {
    render() {

        let jobData = jobsData;
        let { date } = this.props;
        let { start } = ShiftWeekTable.range(date, this.props);
        return (
            <div className="table-responsive">
                <table className="table atable emp_view_table">
                    <tr>
                        <th className="long dayname"> <p className="">Hours Booked</p><p className="hoursWorked">78%</p></th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(0).format('dddd')}</p>
                            <p className="weekDate">{moment().day(0).format('D')}</p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(1).format('dddd')} </p>
                            <p className="weekDate">{moment().day(1).format('D')}</p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(2).format('dddd')} </p>
                            <p className="weekDate">  {moment().day(2).format('D')} </p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(3).format('dddd')} </p>
                            <p className="weekDate"> {moment().day(3).format('D')} </p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(4).format('dddd')} </p>
                            <p className="weekDate"> {moment().day(4).format('D')} </p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(5).format('dddd')} </p>
                            <p className="weekDate"> {moment().day(5).format('D')} </p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(6).format('dddd')} </p>
                            <p className="weekDate"> {moment().day(6).format('D')} </p>
                        </th>
                    </tr>
                    <SpecialDay dateStart={start}/>

                        <tbody className="tbody_scroll">
                        {jobData.map((value,index)=>(
                                <JobsRow data={jobData[index]} key={index}/>
                            )
                        )
                        }
                        </tbody>
                </table>
                <div className="textlist">
                    <table>
                        <tbody>
                        <tr>
                            <td ><div className="mtitle computed-weekly-scheduled-hour "><p className="bfont">weekly hours booked:</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>

                        </tr>
                        <tr>
                            <td ><div className="mtitle"><p className="bfont">weekly spend booked:</p><p className="sfont">$12038 of $18293 | 66%</p></div></td>
                            <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">$1293 of $2019 | 64%</p></div></td>
                            <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                            <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                         </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

ShiftWeekTable.range = (date, { culture }) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return { start, end };
};
