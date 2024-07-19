import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import { MatDialog } from '@angular/material/dialog';

describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
      providers: [{
        provider: MatDialog,
        useValue: {}
      }]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    })
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const cards = el.queryAll(By.css("mat-card-title"));

    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12);
  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const course = component.courses[0];
    const card = el.query(By.css('.course-card:first-child'));
    const cardTitle = el.query(By.css('mat-card-title'));
    const cardImage = el.query(By.css('img'));

    expect(card).toBeTruthy();
    expect(cardTitle.nativeElement.textContent).toBe(course.titles.description);
    expect(cardImage.nativeElement.src).toBe(course.iconUrl);
  });
});


