import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

describe('Calculator Service', () => {
    let calculatorService: CalculatorService;
    let loggerSpy: any;

    beforeEach(() => {
        loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);

        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {
                    provide: LoggerService,
                    useValue: loggerSpy
                }
            ]
        });

        calculatorService = TestBed.inject(CalculatorService);
    })

    it('should add two number', ()=> {
        const res = calculatorService.add(2,2);
        expect(res).toBe(4);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });

    it('should subtract two number', () => {
        const res = calculatorService.subtract(2,2);
        expect(res).toBe(0);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    })
});