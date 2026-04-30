import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ConfirmModalComponent } from './confirm-modal.component';
import { vi } from 'vitest';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let componentRef: ComponentRef<ConfirmModalComponent>;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    // Set the required input signal
    componentRef.setInput('productName', 'Test Product');
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el nombre del producto en el mensaje', () => {
    const messageEl = fixture.nativeElement.querySelector('.modal-message');
    expect(messageEl.textContent).toContain('Test Product');
  });

  it('debería emitir cancel al hacer click en el botón Cancelar', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');
    const btn = fixture.nativeElement.querySelector('.btn-cancel');
    btn.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('debería emitir confirm al hacer click en el botón Confirmar', () => {
    const emitSpy = vi.spyOn(component.confirm, 'emit');
    const btn = fixture.nativeElement.querySelector('.btn-confirm');
    btn.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('debería emitir cancel al hacer click en el overlay', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    overlay.click();
    expect(emitSpy).toHaveBeenCalled();
  });
});
