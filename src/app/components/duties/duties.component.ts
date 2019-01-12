import { Component, OnInit } from '@angular/core';

import { DutyService } from '../../services/duty/duty.service';
import { AuthService } from '../../services/auth/auth.service';
import { DutyStatus } from "../../domain/dutyStatus";

@Component({
    selector: 'app-duties',
    templateUrl: './duties.component.html',
    styleUrls: ['./duties.component.css']
})
export class DutiesComponent implements OnInit {

    dutiesTableData = null;
    dutiesFromDatabase = null;
    dates = [];

    constructor(public authService: AuthService, private dutyService: DutyService) {
      var userName = authService.getUserName();
      if (!userName) {
          userName = 'Filip';
      } 
      this.loadDuties(userName);
    }

    ngOnInit() {
    }

    private loadDuties(userName: string): void {
      this.dutyService.getDuties(userName).subscribe(
        duties => {
            this.dutiesFromDatabase = duties;
            this.calculateDatesRange();
            this.transformDutiesTableData();
        }
      );
    }

    private calculateDatesRange() {
        var startDate = new Date();
        var endDate = new Date();

        this.dutiesFromDatabase.forEach(d => {
            var dutyDateStr = d.date;
            var dutyDate = this.stringToDate(dutyDateStr);

            while (startDate > dutyDate) {
                startDate = this.previousDay(startDate);
            }
            while (endDate < dutyDate) {
                endDate = this.nextDay(endDate);
            }
        });

        var date = new Date(startDate);
        do {
            this.dates.push(this.dateToString(date));
            date = this.nextDay(date);
        } while (date <= endDate);
    }

    private transformDutiesTableData() {
        var data = [];
        this.dates.forEach(d => {
            var element = { date: d, dutyStatuses: []};
                this.dutyTypes.forEach(dt => {
                    element.dutyStatuses.push({
                        date: d,
                        dutyType: dt,
                        user: "Filip",
                        status: undefined
                    });
                }
            )
            data.push(element);
        });

        this.dutiesFromDatabase.forEach(d => {
            data
                .find((x) => x.date === d.date)
                .dutyStatuses
                .find((x) => x.dutyType === d.dutyType)
                .status = d.status;
            }
        );

        this.dutiesTableData = data;
    }    

    public changeStatus(dutyStatus) {
        console.log("Changing status for " + dutyStatus.dutyType + " on " + dutyStatus.date + " from " + dutyStatus.status);
        var rawDuty = this.dutiesFromDatabase.find((x) => x.date === dutyStatus.date && x.dutyType == dutyStatus.dutyType);

        if (!rawDuty) {
                this.dutiesFromDatabase.push({
                date: dutyStatus.date,
                dutyType: dutyStatus.dutyType,
                user: "Filip",
                status: true
            });
        } else {
            if (dutyStatus.status == undefined) {
             rawDuty.status = true;
            } else if (dutyStatus.status == true) {
               rawDuty.status = false;
            } else {
               rawDuty.status = undefined;
            }
        }
        this.transformDutiesTableData();
    }

    public dutyTypes = [ 
        "Obowiązki podstawowe",
        "Coś dla domu",
        "Przygotowanie do szkoły",
        "Porządek w pokoju",
        "W łóżku przed 21:30"];

    dateToString(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
        mm = '0' + mm;
        }

        return yyyy + '-' + mm + '-' + dd;
    }

    stringToDate(dateString) {
        var dateTokens = dateString.split("-");
        return new Date(dateTokens[0], dateTokens[1]-1, dateTokens[2]);
    }

    nextDay(date) {
        var nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    }

    previousDay(date) {
        var previousDay = new Date(date);
        previousDay.setDate(previousDay.getDate() - 1);
        return previousDay;
    }
}