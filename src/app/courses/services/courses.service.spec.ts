import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { COURSES, LESSONS, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { partial } from "cypress/types/lodash";
import { HttpErrorResponse } from "@angular/common/http";

describe("Course Service", () => {

    let courseSerive: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ CoursesService]
        });

        courseSerive = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should find course by Id', () => {
        courseSerive.findCourseById(12)
            .subscribe(course => {
                expect(course).toBeTruthy();
                expect(course.id).toBe(12);
            });
        
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toBe('GET');
        req.flush(COURSES[12]);
    });

    it('should retrieve all courses', () => {
        courseSerive.findAllCourses()
            .subscribe(courses => {
                expect(courses).toBeTruthy('Courses list is empty');
                expect(courses.length).toBe(12, "Courses length is not 12");

                const course = courses.find(course => course.id === 12);
                expect(course.titles.description === 'Angular Testing Course');
            });
        
        const req = httpTestingController.expectOne('/api/courses', 'Request make with specific url');
        expect(req.request.method).toBe('GET');
        req.flush({payload: Object.values(COURSES)});
    });

    it('should save the course data', () => {
        const courseKey = 12;
        const updateCourse = {titles: { description: 'Angular Testing Course V17'}}
        courseSerive.saveCourse(courseKey, updateCourse)
            .subscribe(course => {
                expect(course).toBeTruthy();
                expect(course.titles.description).toBe('Angular Testing Course V17');
            });
        // courseSerive.findAllCourses().subscribe(coures =>{ });

        let req = httpTestingController.expectOne(`/api/courses/${courseKey}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body.titles.description).toEqual(updateCourse.titles.description);

        const course = COURSES[courseKey];
        const newUpdatedFlusedCourse = {...course, ...updateCourse};
        req.flush(newUpdatedFlusedCourse);
    });

    it('should give me an error if save course fails', () => {
        const courseChanges = { titles: { description: 'We have to see error on save' }} as Partial<Course>;
        courseSerive.saveCourse(12, courseChanges)
            .subscribe(() => fail('the save course operation should have failed'),
            (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);

            });
        
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toBe('PUT');

        req.flush('Save course failed', { status: 500, statusText: "Internal Server Error"});

    });

    it('should find a list of lessons', () => {
        courseSerive.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3)
            });

        const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual("12");
        expect(req.request.params.get('filter')).toEqual("");
        expect(req.request.params.get('pageNumber')).toEqual("0");

        req.flush({
            payload: findLessonsForCourse(12).slice(0,3)
        })
        
    });

    afterEach(() => {
        httpTestingController.verify();
    })
})