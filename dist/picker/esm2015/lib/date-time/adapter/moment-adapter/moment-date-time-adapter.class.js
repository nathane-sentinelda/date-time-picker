/**
 * moment-date-time-adapter.class
 */
import { Inject, Injectable, Optional, InjectionToken } from '@angular/core';
// import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import * as _moment from 'moment/moment';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '../date-time-adapter.class';
import * as i0 from "@angular/core";
const moment = _moment.default ? _moment.default : _moment;
/** InjectionToken for moment date adapter to configure options. */
export const OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS = new InjectionToken('OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS', {
    providedIn: 'root',
    factory: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS_FACTORY
});
/** @docs-private */
export function OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS_FACTORY() {
    return {
        useUtc: false
    };
}
/** Creates an array and fills it with values. */
function range(length, valueFunction) {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}
export class MomentDateTimeAdapter extends DateTimeAdapter {
    constructor(owlDateTimeLocale, options) {
        super();
        this.owlDateTimeLocale = owlDateTimeLocale;
        this.options = options;
        this.setLocale(owlDateTimeLocale || moment.locale());
    }
    setLocale(locale) {
        super.setLocale(locale);
        const momentLocaleData = moment.localeData(locale);
        this._localeData = {
            longMonths: momentLocaleData.months(),
            shortMonths: momentLocaleData.monthsShort(),
            longDaysOfWeek: momentLocaleData.weekdays(),
            shortDaysOfWeek: momentLocaleData.weekdaysShort(),
            narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
            dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
        };
    }
    getYear(date) {
        return this.clone(date).year();
    }
    getMonth(date) {
        return this.clone(date).month();
    }
    getDay(date) {
        return this.clone(date).day();
    }
    getDate(date) {
        return this.clone(date).date();
    }
    getHours(date) {
        return this.clone(date).hours();
    }
    getMinutes(date) {
        return this.clone(date).minutes();
    }
    getSeconds(date) {
        return this.clone(date).seconds();
    }
    getTime(date) {
        return this.clone(date).valueOf();
    }
    getNumDaysInMonth(date) {
        return this.clone(date).daysInMonth();
    }
    differenceInCalendarDays(dateLeft, dateRight) {
        return this.clone(dateLeft).diff(dateRight, 'days');
    }
    getYearName(date) {
        return this.clone(date).format('YYYY');
    }
    getMonthNames(style) {
        return style === 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
    }
    getDayOfWeekNames(style) {
        if (style === 'long') {
            return this._localeData.longDaysOfWeek;
        }
        if (style === 'short') {
            return this._localeData.shortDaysOfWeek;
        }
        return this._localeData.narrowDaysOfWeek;
    }
    getDateNames() {
        return this._localeData.dates;
    }
    toIso8601(date) {
        return this.clone(date).format();
    }
    isEqual(dateLeft, dateRight) {
        if (dateLeft && dateRight) {
            return this.clone(dateLeft).isSame(this.clone(dateRight));
        }
        return dateLeft === dateRight;
    }
    isSameDay(dateLeft, dateRight) {
        if (dateLeft && dateRight) {
            return this.clone(dateLeft).isSame(this.clone(dateRight), 'day');
        }
        return dateLeft === dateRight;
    }
    isValid(date) {
        return this.clone(date).isValid();
    }
    invalid() {
        return moment.invalid();
    }
    isDateInstance(obj) {
        return moment.isMoment(obj);
    }
    addCalendarYears(date, amount) {
        return this.clone(date).add({ years: amount });
    }
    addCalendarMonths(date, amount) {
        return this.clone(date).add({ months: amount });
    }
    addCalendarDays(date, amount) {
        return this.clone(date).add({ days: amount });
    }
    setHours(date, amount) {
        return this.clone(date).hours(amount);
    }
    setMinutes(date, amount) {
        return this.clone(date).minutes(amount);
    }
    setSeconds(date, amount) {
        return this.clone(date).seconds(amount);
    }
    createDate(year, month, date, hours = 0, minutes = 0, seconds = 0) {
        if (month < 0 || month > 11) {
            throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
        }
        if (date < 1) {
            throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
        }
        if (hours < 0 || hours > 23) {
            throw Error(`Invalid hours "${hours}". Hours has to be between 0 and 23.`);
        }
        if (minutes < 0 || minutes > 59) {
            throw Error(`Invalid minutes "${minutes}". Minutes has to between 0 and 59.`);
        }
        if (seconds < 0 || seconds > 59) {
            throw Error(`Invalid seconds "${seconds}". Seconds has to be between 0 and 59.`);
        }
        const result = this.createMoment({ year, month, date, hours, minutes, seconds }).locale(this.locale);
        // If the result isn't valid, the date must have been out of bounds for this month.
        if (!result.isValid()) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }
        return result;
    }
    clone(date) {
        return this.createMoment(date).clone().locale(this.locale);
    }
    now() {
        return this.createMoment().locale(this.locale);
    }
    format(date, displayFormat) {
        date = this.clone(date);
        if (!this.isValid(date)) {
            throw Error('MomentDateTimeAdapter: Cannot format invalid date.');
        }
        return date.format(displayFormat);
    }
    parse(value, parseFormat) {
        if (value && typeof value === 'string') {
            return this.createMoment(value, parseFormat, this.locale);
        }
        return value ? this.createMoment(value).locale(this.locale) : null;
    }
    /**
     * Returns the given value if given a valid Moment or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid Moments and empty
     * string into null. Returns an invalid date for all other values.
     */
    deserialize(value) {
        let date;
        if (value instanceof Date) {
            date = this.createMoment(value);
        }
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            date = this.createMoment(value, moment.ISO_8601).locale(this.locale);
        }
        if (date && this.isValid(date)) {
            return date;
        }
        return super.deserialize(value);
    }
    /** Creates a Moment instance while respecting the current UTC settings. */
    createMoment(...args) {
        return (this.options && this.options.useUtc) ? moment.utc(...args) : moment(...args);
    }
}
MomentDateTimeAdapter.ɵfac = function MomentDateTimeAdapter_Factory(t) { return new (t || MomentDateTimeAdapter)(i0.ɵɵinject(OWL_DATE_TIME_LOCALE, 8), i0.ɵɵinject(OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, 8)); };
MomentDateTimeAdapter.ɵprov = i0.ɵɵdefineInjectable({ token: MomentDateTimeAdapter, factory: MomentDateTimeAdapter.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MomentDateTimeAdapter, [{
        type: Injectable
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [OWL_DATE_TIME_LOCALE]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9tZW50LWRhdGUtdGltZS1hZGFwdGVyLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctcGljay1kYXRldGltZS8iLCJzb3VyY2VzIjpbImxpYi9kYXRlLXRpbWUvYWRhcHRlci9tb21lbnQtYWRhcHRlci9tb21lbnQtZGF0ZS10aW1lLWFkYXB0ZXIuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdFLDRFQUE0RTtBQUM1RSxPQUFPLEtBQUssT0FBTyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBRW5GLE1BQU0sTUFBTSxHQUFJLE9BQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFFLE9BQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQVk3RSxtRUFBbUU7QUFDbkUsTUFBTSxDQUFDLE1BQU0sb0NBQW9DLEdBQUcsSUFBSSxjQUFjLENBQ2xFLHNDQUFzQyxFQUFFO0lBQ3BDLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSw0Q0FBNEM7Q0FDeEQsQ0FBQyxDQUFDO0FBRVAsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSw0Q0FBNEM7SUFDeEQsT0FBTztRQUNILE1BQU0sRUFBRSxLQUFLO0tBQ2hCLENBQUM7QUFDTixDQUFDO0FBRUQsaURBQWlEO0FBQ2pELFNBQVMsS0FBSyxDQUFJLE1BQWMsRUFBRSxhQUFtQztJQUNqRSxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QixXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsYUFB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dGVyLmNsYXNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCwgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuLy8gaW1wb3J0IHsgRGF0ZVRpbWVBZGFwdGVyLCBPV0xfREFURV9USU1FX0xPQ0FMRSB9IGZyb20gJ25nLXBpY2stZGF0ZXRpbWUnO1xyXG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudC9tb21lbnQnO1xyXG5pbXBvcnQgeyBNb21lbnQgfSBmcm9tICdtb21lbnQvbW9tZW50JztcclxuaW1wb3J0IHsgRGF0ZVRpbWVBZGFwdGVyLCBPV0xfREFURV9USU1FX0xPQ0FMRSB9IGZyb20gJy4uL2RhdGUtdGltZS1hZGFwdGVyLmNsYXNzJztcclxuXHJcbmNvbnN0IG1vbWVudCA9IChfbW9tZW50IGFzIGFueSkuZGVmYXVsdCA/IChfbW9tZW50IGFzIGFueSkuZGVmYXVsdCA6IF9tb21lbnQ7XHJcblxyXG4vKiogQ29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIHtAc2VlIE1vbWVudERhdGVBZGFwdGVyfS4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBPd2xNb21lbnREYXRlVGltZUFkYXB0ZXJPcHRpb25zIHtcclxuICAgIC8qKlxyXG4gICAgICogVHVybnMgdGhlIHVzZSBvZiB1dGMgZGF0ZXMgb24gb3Igb2ZmLlxyXG4gICAgICogQ2hhbmdpbmcgdGhpcyB3aWxsIGNoYW5nZSBob3cgdGhlIERhdGVUaW1lUGlja2VyIG91dHB1dCB2YWx1ZS5cclxuICAgICAqIHtAZGVmYXVsdCBmYWxzZX1cclxuICAgICAqL1xyXG4gICAgdXNlVXRjOiBib29sZWFuO1xyXG59XHJcblxyXG4vKiogSW5qZWN0aW9uVG9rZW4gZm9yIG1vbWVudCBkYXRlIGFkYXB0ZXIgdG8gY29uZmlndXJlIG9wdGlvbnMuICovXHJcbmV4cG9ydCBjb25zdCBPV0xfTU9NRU5UX0RBVEVfVElNRV9BREFQVEVSX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48T3dsTW9tZW50RGF0ZVRpbWVBZGFwdGVyT3B0aW9ucz4oXHJcbiAgICAnT1dMX01PTUVOVF9EQVRFX1RJTUVfQURBUFRFUl9PUFRJT05TJywge1xyXG4gICAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcclxuICAgICAgICBmYWN0b3J5OiBPV0xfTU9NRU5UX0RBVEVfVElNRV9BREFQVEVSX09QVElPTlNfRkFDVE9SWVxyXG4gICAgfSk7XHJcblxyXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xyXG5leHBvcnQgZnVuY3Rpb24gT1dMX01PTUVOVF9EQVRFX1RJTUVfQURBUFRFUl9PUFRJT05TX0ZBQ1RPUlkoKTogT3dsTW9tZW50RGF0ZVRpbWVBZGFwdGVyT3B0aW9ucyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVzZVV0YzogZmFsc2VcclxuICAgIH07XHJcbn1cclxuXHJcbi8qKiBDcmVhdGVzIGFuIGFycmF5IGFuZCBmaWxscyBpdCB3aXRoIHZhbHVlcy4gKi9cclxuZnVuY3Rpb24gcmFuZ2U8VD4obGVuZ3RoOiBudW1iZXIsIHZhbHVlRnVuY3Rpb246IChpbmRleDogbnVtYmVyKSA9PiBUKTogVFtdIHtcclxuICAgIGNvbnN0IHZhbHVlc0FycmF5ID0gQXJyYXkobGVuZ3RoKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YWx1ZXNBcnJheVtpXSA9IHZhbHVlRnVuY3Rpb24oaSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWVzQXJyYXk7XHJcbn1cclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBNb21lbnREYXRlVGltZUFkYXB0ZXIgZXh0ZW5kcyBEYXRlVGltZUFkYXB0ZXI8TW9tZW50PiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfbG9jYWxlRGF0YToge1xyXG4gICAgICAgIGxvbmdNb250aHM6IHN0cmluZ1tdLFxyXG4gICAgICAgIHNob3J0TW9udGhzOiBzdHJpbmdbXSxcclxuICAgICAgICBsb25nRGF5c09mV2Vlazogc3RyaW5nW10sXHJcbiAgICAgICAgc2hvcnREYXlzT2ZXZWVrOiBzdHJpbmdbXSxcclxuICAgICAgICBuYXJyb3dEYXlzT2ZXZWVrOiBzdHJpbmdbXSxcclxuICAgICAgICBkYXRlczogc3RyaW5nW10sXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBAT3B0aW9uYWwoKSBASW5qZWN0KE9XTF9EQVRFX1RJTUVfTE9DQUxFKSBwcml2YXRlIG93bERhdGVUaW1lTG9jYWxlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChPV0xfTU9NRU5UX0RBVEVfVElNRV9BREFQVEVSX09QVElPTlMpIHByaXZhdGUgb3B0aW9ucz86IE93bE1vbWVudERhdGVUaW1lQWRhcHRlck9wdGlvbnMgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnNldExvY2FsZShvd2xEYXRlVGltZUxvY2FsZSB8fCBtb21lbnQubG9jYWxlKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRMb2NhbGUoIGxvY2FsZTogc3RyaW5nICkge1xyXG4gICAgICAgIHN1cGVyLnNldExvY2FsZShsb2NhbGUpO1xyXG5cclxuICAgICAgICBjb25zdCBtb21lbnRMb2NhbGVEYXRhID0gbW9tZW50LmxvY2FsZURhdGEobG9jYWxlKTtcclxuICAgICAgICB0aGlzLl9sb2NhbGVEYXRhID0ge1xyXG4gICAgICAgICAgICBsb25nTW9udGhzOiBtb21lbnRMb2NhbGVEYXRhLm1vbnRocygpLFxyXG4gICAgICAgICAgICBzaG9ydE1vbnRoczogbW9tZW50TG9jYWxlRGF0YS5tb250aHNTaG9ydCgpLFxyXG4gICAgICAgICAgICBsb25nRGF5c09mV2VlazogbW9tZW50TG9jYWxlRGF0YS53ZWVrZGF5cygpLFxyXG4gICAgICAgICAgICBzaG9ydERheXNPZldlZWs6IG1vbWVudExvY2FsZURhdGEud2Vla2RheXNTaG9ydCgpLFxyXG4gICAgICAgICAgICBuYXJyb3dEYXlzT2ZXZWVrOiBtb21lbnRMb2NhbGVEYXRhLndlZWtkYXlzTWluKCksXHJcbiAgICAgICAgICAgIGRhdGVzOiByYW5nZSgzMSwgKGkpID0+IHRoaXMuY3JlYXRlRGF0ZSgyMDE3LCAwLCBpICsgMSkuZm9ybWF0KCdEJykpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBnZXRZZWFyKCBkYXRlOiBNb21lbnQgKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZShkYXRlKS55ZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE1vbnRoKCBkYXRlOiBNb21lbnQgKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZShkYXRlKS5tb250aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREYXkoIGRhdGU6IE1vbWVudCApOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKGRhdGUpLmRheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREYXRlKCBkYXRlOiBNb21lbnQgKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZShkYXRlKS5kYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhvdXJzKCBkYXRlOiBNb21lbnQgKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZShkYXRlKS5ob3VycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNaW51dGVzKCBkYXRlOiBNb21lbnQgKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZShkYXRlKS5taW51dGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlY29uZHMoIGRhdGU6IE1vbWVudCApOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKGRhdGUpLnNlY29uZHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VGltZSggZGF0ZTogTW9tZW50ICk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoZGF0ZSkudmFsdWVPZigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROdW1EYXlzSW5Nb250aCggZGF0ZTogTW9tZW50ICk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoZGF0ZSkuZGF5c0luTW9udGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlmZmVyZW5jZUluQ2FsZW5kYXJEYXlzKCBkYXRlTGVmdDogTW9tZW50LCBkYXRlUmlnaHQ6IE1vbWVudCApOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKGRhdGVMZWZ0KS5kaWZmKGRhdGVSaWdodCwgJ2RheXMnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0WWVhck5hbWUoIGRhdGU6IE1vbWVudCApOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKGRhdGUpLmZvcm1hdCgnWVlZWScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNb250aE5hbWVzKCBzdHlsZTogJ2xvbmcnIHwgJ3Nob3J0JyB8ICduYXJyb3cnICk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gc3R5bGUgPT09ICdsb25nJyA/IHRoaXMuX2xvY2FsZURhdGEubG9uZ01vbnRocyA6IHRoaXMuX2xvY2FsZURhdGEuc2hvcnRNb250aHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERheU9mV2Vla05hbWVzKCBzdHlsZTogJ2xvbmcnIHwgJ3Nob3J0JyB8ICduYXJyb3cnICk6IHN0cmluZ1tdIHtcclxuICAgICAgICBpZiAoc3R5bGUgPT09ICdsb25nJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlRGF0YS5sb25nRGF5c09mV2VlaztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0eWxlID09PSAnc2hvcnQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGVEYXRhLnNob3J0RGF5c09mV2VlaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZURhdGEubmFycm93RGF5c09mV2VlaztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGF0ZU5hbWVzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlRGF0YS5kYXRlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9Jc284NjAxKCBkYXRlOiBNb21lbnQgKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZShkYXRlKS5mb3JtYXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNFcXVhbCggZGF0ZUxlZnQ6IE1vbWVudCwgZGF0ZVJpZ2h0OiBNb21lbnQgKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGlmIChkYXRlTGVmdCAmJiBkYXRlUmlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoZGF0ZUxlZnQpLmlzU2FtZSh0aGlzLmNsb25lKGRhdGVSaWdodCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGVMZWZ0ID09PSBkYXRlUmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzU2FtZURheSggZGF0ZUxlZnQ6IE1vbWVudCwgZGF0ZVJpZ2h0OiBNb21lbnQgKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGlmIChkYXRlTGVmdCAmJiBkYXRlUmlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoZGF0ZUxlZnQpLmlzU2FtZSh0aGlzLmNsb25lKGRhdGVSaWdodCksICdkYXknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRlTGVmdCA9PT0gZGF0ZVJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc1ZhbGlkKCBkYXRlOiBNb21lbnQgKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoZGF0ZSkuaXNWYWxpZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnZhbGlkKCk6IE1vbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudC5pbnZhbGlkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRGF0ZUluc3RhbmNlKCBvYmo6IGFueSApOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbW9tZW50LmlzTW9tZW50KG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENhbGVuZGFyWWVhcnMoIGRhdGU6IE1vbWVudCwgYW1vdW50OiBudW1iZXIgKTogTW9tZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZShkYXRlKS5hZGQoe3llYXJzOiBhbW91bnR9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2FsZW5kYXJNb250aHMoIGRhdGU6IE1vbWVudCwgYW1vdW50OiBudW1iZXIgKTogTW9tZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZShkYXRlKS5hZGQoe21vbnRoczogYW1vdW50fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENhbGVuZGFyRGF5cyggZGF0ZTogTW9tZW50LCBhbW91bnQ6IG51bWJlciApOiBNb21lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKGRhdGUpLmFkZCh7ZGF5czogYW1vdW50fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEhvdXJzKCBkYXRlOiBNb21lbnQsIGFtb3VudDogbnVtYmVyICk6IE1vbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoZGF0ZSkuaG91cnMoYW1vdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TWludXRlcyggZGF0ZTogTW9tZW50LCBhbW91bnQ6IG51bWJlciApOiBNb21lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKGRhdGUpLm1pbnV0ZXMoYW1vdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0U2Vjb25kcyggZGF0ZTogTW9tZW50LCBhbW91bnQ6IG51bWJlciApOiBNb21lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKGRhdGUpLnNlY29uZHMoYW1vdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlRGF0ZSggeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXRlOiBudW1iZXIgKTogTW9tZW50O1xyXG4gICAgcHVibGljIGNyZWF0ZURhdGUoIHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF0ZTogbnVtYmVyLCBob3VyczogbnVtYmVyID0gMCwgbWludXRlczogbnVtYmVyID0gMCwgc2Vjb25kczogbnVtYmVyID0gMCApOiBNb21lbnQge1xyXG4gICAgICAgIGlmIChtb250aCA8IDAgfHwgbW9udGggPiAxMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgSW52YWxpZCBtb250aCBpbmRleCBcIiR7bW9udGh9XCIuIE1vbnRoIGluZGV4IGhhcyB0byBiZSBiZXR3ZWVuIDAgYW5kIDExLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGUgPCAxKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIGRhdGUgXCIke2RhdGV9XCIuIERhdGUgaGFzIHRvIGJlIGdyZWF0ZXIgdGhhbiAwLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGhvdXJzIDwgMCB8fCBob3VycyA+IDIzKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIGhvdXJzIFwiJHtob3Vyc31cIi4gSG91cnMgaGFzIHRvIGJlIGJldHdlZW4gMCBhbmQgMjMuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWludXRlcyA8IDAgfHwgbWludXRlcyA+IDU5KSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIG1pbnV0ZXMgXCIke21pbnV0ZXN9XCIuIE1pbnV0ZXMgaGFzIHRvIGJldHdlZW4gMCBhbmQgNTkuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2Vjb25kcyA8IDAgfHwgc2Vjb25kcyA+IDU5KSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIHNlY29uZHMgXCIke3NlY29uZHN9XCIuIFNlY29uZHMgaGFzIHRvIGJlIGJldHdlZW4gMCBhbmQgNTkuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmNyZWF0ZU1vbWVudCh7eWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzfSkubG9jYWxlKHRoaXMubG9jYWxlKTtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIHJlc3VsdCBpc24ndCB2YWxpZCwgdGhlIGRhdGUgbXVzdCBoYXZlIGJlZW4gb3V0IG9mIGJvdW5kcyBmb3IgdGhpcyBtb250aC5cclxuICAgICAgICBpZiAoIXJlc3VsdC5pc1ZhbGlkKCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYEludmFsaWQgZGF0ZSBcIiR7ZGF0ZX1cIiBmb3IgbW9udGggd2l0aCBpbmRleCBcIiR7bW9udGh9XCIuYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSggZGF0ZTogTW9tZW50ICk6IE1vbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTW9tZW50KGRhdGUpLmNsb25lKCkubG9jYWxlKHRoaXMubG9jYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbm93KCk6IE1vbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTW9tZW50KCkubG9jYWxlKHRoaXMubG9jYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9ybWF0KCBkYXRlOiBNb21lbnQsIGRpc3BsYXlGb3JtYXQ6IGFueSApOiBzdHJpbmcge1xyXG4gICAgICAgIGRhdGUgPSB0aGlzLmNsb25lKGRhdGUpO1xyXG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKGRhdGUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdNb21lbnREYXRlVGltZUFkYXB0ZXI6IENhbm5vdCBmb3JtYXQgaW52YWxpZCBkYXRlLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0ZS5mb3JtYXQoZGlzcGxheUZvcm1hdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBhcnNlKCB2YWx1ZTogYW55LCBwYXJzZUZvcm1hdDogYW55ICk6IE1vbWVudCB8IG51bGwge1xyXG4gICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU1vbWVudCh2YWx1ZSwgcGFyc2VGb3JtYXQsIHRoaXMubG9jYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID8gdGhpcy5jcmVhdGVNb21lbnQodmFsdWUpLmxvY2FsZSh0aGlzLmxvY2FsZSkgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZ2l2ZW4gdmFsdWUgaWYgZ2l2ZW4gYSB2YWxpZCBNb21lbnQgb3IgbnVsbC4gRGVzZXJpYWxpemVzIHZhbGlkIElTTyA4NjAxIHN0cmluZ3NcclxuICAgICAqIChodHRwczovL3d3dy5pZXRmLm9yZy9yZmMvcmZjMzMzOS50eHQpIGFuZCB2YWxpZCBEYXRlIG9iamVjdHMgaW50byB2YWxpZCBNb21lbnRzIGFuZCBlbXB0eVxyXG4gICAgICogc3RyaW5nIGludG8gbnVsbC4gUmV0dXJucyBhbiBpbnZhbGlkIGRhdGUgZm9yIGFsbCBvdGhlciB2YWx1ZXMuXHJcbiAgICAgKi9cclxuICAgIGRlc2VyaWFsaXplKCB2YWx1ZTogYW55ICk6IE1vbWVudCB8IG51bGwge1xyXG4gICAgICAgIGxldCBkYXRlO1xyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZSA9IHRoaXMuY3JlYXRlTW9tZW50KHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0ZSA9IHRoaXMuY3JlYXRlTW9tZW50KHZhbHVlLCBtb21lbnQuSVNPXzg2MDEpLmxvY2FsZSh0aGlzLmxvY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRlICYmIHRoaXMuaXNWYWxpZChkYXRlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQ3JlYXRlcyBhIE1vbWVudCBpbnN0YW5jZSB3aGlsZSByZXNwZWN0aW5nIHRoZSBjdXJyZW50IFVUQyBzZXR0aW5ncy4gKi9cclxuICAgIHByaXZhdGUgY3JlYXRlTW9tZW50KC4uLmFyZ3M6IGFueVtdKTogTW9tZW50IHtcclxuICAgICAgICByZXR1cm4gKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMudXNlVXRjKSA/IG1vbWVudC51dGMoLi4uYXJncykgOiBtb21lbnQoLi4uYXJncyk7XHJcbiAgICB9XHJcbn1cclxuIl19