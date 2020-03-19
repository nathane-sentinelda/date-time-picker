/**
 * timer-box.component
 */
import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class OwlTimerBoxComponent implements OnInit, OnDestroy {
    showDivider: boolean;
    upBtnAriaLabel: string;
    upBtnDisabled: boolean;
    downBtnAriaLabel: string;
    downBtnDisabled: boolean;
    /**
     * Value would be displayed in the box
     * If it is null, the box would display [value]
     * */
    boxValue: number;
    value: number;
    min: number;
    max: number;
    step: number;
    inputLabel: string;
    valueChange: EventEmitter<number>;
    inputChange: EventEmitter<number>;
    private inputStream;
    private inputStreamSub;
    get displayValue(): number;
    get owlDTTimerBoxClass(): boolean;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    upBtnClicked(): void;
    downBtnClicked(): void;
    handleInputChange(val: string): void;
    private updateValue;
    private updateValueViaInput;
    static ɵfac: i0.ɵɵFactoryDef<OwlTimerBoxComponent>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<OwlTimerBoxComponent, "owl-date-time-timer-box", ["owlDateTimeTimerBox"], { "showDivider": "showDivider"; "upBtnAriaLabel": "upBtnAriaLabel"; "upBtnDisabled": "upBtnDisabled"; "downBtnAriaLabel": "downBtnAriaLabel"; "downBtnDisabled": "downBtnDisabled"; "boxValue": "boxValue"; "value": "value"; "min": "min"; "max": "max"; "step": "step"; "inputLabel": "inputLabel"; }, { "valueChange": "valueChange"; "inputChange": "inputChange"; }, never>;
}
