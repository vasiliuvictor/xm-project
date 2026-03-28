import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, MatToolbarModule, MatButtonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render brand link pointing to GitHub', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brand = compiled.querySelector('.brand') as HTMLAnchorElement;
    expect(brand).toBeTruthy();
    expect(brand.href).toContain('github.com/vasiliuvictor');
    expect(brand.target).toBe('_blank');
  });

  it('should render brand name and author', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-name')?.textContent?.trim()).toBe('PhotoStream');
    expect(compiled.querySelector('.brand-author')?.textContent?.trim()).toContain('Andrei-Victor Vasiliu');
  });

  it('should render Photos and Favorites nav buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.nav-buttons a');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent?.trim()).toBe('Photos');
    expect(navLinks[1].textContent?.trim()).toBe('Favorites');
  });

  it('should have correct routerLink attributes on nav buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.nav-buttons a');
    expect(navLinks[0].getAttribute('href')).toBe('/');
    expect(navLinks[1].getAttribute('href')).toBe('/favorites');
  });
});
