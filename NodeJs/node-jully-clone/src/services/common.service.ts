// const moment = require('moment');
import moment from 'moment';
import validator from 'validator';
import UserTableModel from '../abstractions/models/user-table-model';

interface GPS_LOCATION {
  latitude: string;
  longitude: string;
  address: string;
}

interface AttendanceData {
  checkInLocation: GPS_LOCATION | string;
}
export class CommonService {

  async calculateTimeDiff(start: string, end: string): Promise<string> {
      let timeDiff = "00:00:00";
      if (start && end) {
        const startTime = moment(start, 'HH:mm:ss');
        const endTime = moment(end, 'HH:mm:ss');

        if (startTime.isValid() && endTime.isValid()) {
          const duration = moment.duration(endTime.diff(startTime));
          const hoursDiff = Math.floor(duration.asHours());
          const minutesDiff = duration.minutes();
          const secondsDiff = duration.seconds();
          timeDiff = moment.utc().hours(hoursDiff).minutes(minutesDiff).seconds(secondsDiff).format('HH:mm:ss');
        }
      }

      return timeDiff;
    }

    

   calculateDuration(checkInTime: string): string {
    let checkIn:any = moment(checkInTime, "HH:mm:ss");
    let checkOut:any = moment();
    let duration:any = moment.duration(checkOut.diff(checkIn));
    let hours:any = parseInt(duration.asHours());
    let minutes:any = parseInt(duration.asMinutes()) - hours * 60;
    let seconds:any = parseInt(duration.asSeconds()) - hours * 60 * 60 - minutes * 60;
    let formattedHours: string = hours.toString().padStart(2, '0');
    let formattedMinutes: string = minutes.toString().padStart(2, '0');
    let formattedSeconds: string = seconds.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }


   calculateDurationOnCheckInCheckOut(checkInTime:string,checkOutTime:string) {

    let checkIn:any = moment(checkInTime, "HH:mm:ss");
    let checkOut:any = moment(checkOutTime, "HH:mm:ss");
    let duration:any = moment.duration(checkOut.diff(checkIn));
    let hours:any = parseInt(duration.asHours());
    let minutes:any = parseInt(duration.asMinutes()) - hours * 60;
    let seconds:any = parseInt(duration.asSeconds()) - hours * 60 * 60 - minutes * 60;
    let formattedHours: string = hours.toString().padStart(2, '0');
    let formattedMinutes: string = minutes.toString().padStart(2, '0');
    let formattedSeconds: string = seconds.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }


   calculateTotalHours(totalWorkedHours:string) {
    const hours = parseInt(totalWorkedHours.substring(0, 2));
    const minutes = parseInt(totalWorkedHours.substring(3, 5));
    const seconds = parseInt(totalWorkedHours.substring(6, 8));
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const totalHours = totalSeconds / 3600;
    return totalHours;
  }
  //location type check along with empty values
  isGPSLocation(obj: any): obj is GPS_LOCATION {
    return (
      obj &&
      typeof obj.latitude === 'string' &&
      typeof obj.longitude === 'string' &&
      typeof obj.address === 'string'
    );
  }


  companyConfigValidation(configuration: any) {
    const workHoursRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
    let errorMessage:string = '';
    if (typeof configuration !== 'object') {
      // Handle invalid configuration format
      errorMessage = "Invalid configuration format";
    } else if (typeof configuration.app !== 'object') {
      // Handle invalid app configuration format
      errorMessage = "Invalid app configuration format";
    } else if (typeof configuration.app.is_display !== 'object') {
      // Handle invalid app is_display configuration format
      errorMessage = "Invalid app is-display configuration format";
    } else if (
      typeof configuration.app.is_display.time !== 'boolean' ||
      typeof configuration.app.is_display.photo !== 'boolean' ||
      typeof configuration.app.cico_with_otp !== 'boolean'
    ) {
      // Handle invalid app is_display configuration values
      errorMessage = "Invalid app is-display configuration values";
    } else if (typeof configuration.web !== 'object') {
      // Handle invalid web configuration format
      errorMessage = "Invalid web configuration format";
    } else if (typeof configuration.web.is_display !== 'object') {
      // Handle invalid web is_display configuration format
      errorMessage = "Invalid web is-display configuration format";
    } else if (
      typeof configuration.web.is_display.time !== 'boolean' ||
      typeof configuration.web.is_display.photo !== 'boolean'
    ) {
      // Handle invalid web is_display configuration values
      errorMessage = "Invalid web is-display configuration values";
    } else if (typeof configuration.desktop !== 'object') {
      // Handle invalid desktop configuration format
      errorMessage = "Invalid desktop configuration format";
    } else if (typeof configuration.desktop.is_display !== 'object') {
      // Handle invalid desktop is_display configuration format
      errorMessage = "Invalid desktop is-display configuration format";
    } else if (
      typeof configuration.desktop.is_display.time !== 'boolean' ||
      typeof configuration.desktop.is_display.photo !== 'boolean'
    ) {
      // Handle invalid desktop is_display configuration values
      errorMessage = "Invalid desktop is-display configuration values";
    } else if (!workHoursRegex.test(configuration.work_hours)) {
      // Handle invalid work_hours configuration format
      errorMessage = "Invalid work-hours configuration format";
    } else if (typeof configuration.visitors !== 'object') {
      // Handle invalid visitors configuration format
      errorMessage = "Invalid visitors configuration format";
    } else if (
      typeof configuration.visitors.document !== 'boolean' ||
      typeof configuration.visitors.checkout !== 'boolean'
    ) {
      // Handle invalid visitors configuration values
      errorMessage = "Invalid visitors configuration values";
    }
    else if(typeof configuration.weekend !== 'string' || validator.isEmpty(configuration.weekend)){
      errorMessage = "Weekend configuration is required";
    }
    // if(typeof configuration.weekend == 'string' ){
    //   configuration.weekend = "Saturday,Sunday";
    // }

    return errorMessage;
  }

  getValidateUUIDWithEmployee = async (value:string,companyId:string): Promise<string|Boolean> => {
    if(!validator.isUUID(value)){
      // throw new Error("Invalid employee selected!");
      return "Invalid employee selected!"
    }
    const employeeDataResult:any = await UserTableModel.findOne({where:{id:value,company_id:companyId,is_deleted:false},raw:true});
    if(!employeeDataResult || employeeDataResult == null || employeeDataResult == undefined){
      // throw new Error("Employee doesn't found!");
      return "Employee doesn't found!";
    }
    return true;
  
  }
  
}