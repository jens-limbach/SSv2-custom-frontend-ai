import { ChangeDetectionStrategy, Component, output, signal, inject, input, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SampleService } from '../../services/sample.service';
import { CrmService } from '../../services/crm.service';
import { CreateSamplePayload, Sample } from '../../models/sample.model';
import { CommonModule } from '@angular/common';
import { EntitySelectorComponent, SelectableEntity } from '../entity-selector/entity-selector.component';
import { CodeSelectorComponent, SelectOption } from '../code-selector/code-selector.component';
import { CURRENCIES, UNITS_OF_MEASURE } from '../../models/reference-data.model';

@Component({
  selector: 'app-edit-sample-modal',
  templateUrl: './edit-sample-modal.component.html',
  styleUrl: './edit-sample-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, EntitySelectorComponent, CodeSelectorComponent]
})
export class EditSampleModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly sampleService = inject(SampleService);
  private readonly crmService = inject(CrmService);

  readonly sample = input<Sample | null>(null);

  protected readonly isOpen = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  
  // CRM Entity Lists
  protected readonly opportunities = signal<SelectableEntity[]>([]);
  protected readonly accounts = signal<SelectableEntity[]>([]);
  protected readonly products = signal<SelectableEntity[]>([]);
  protected readonly employees = signal<SelectableEntity[]>([]);
  protected readonly serviceCases = signal<SelectableEntity[]>([]);
  
  // Reference data
  protected readonly currencies: SelectOption[] = CURRENCIES;
  protected readonly unitsOfMeasure: SelectOption[] = UNITS_OF_MEASURE;

  readonly sampleUpdated = output<void>();
  readonly modalClosed = output<void>();

  protected onAccountSelected(accountId: string) {
    this.sampleForm.patchValue({ accountId });
    
    if (accountId) {
      this.crmService.getAccountById(accountId).subscribe({
        next: (account) => {
          if (account?.defaultAddress?.formattedPostalAddressDescription) {
            this.sampleForm.patchValue({
              shipToAddress: account.defaultAddress.formattedPostalAddressDescription
            });
          }
        },
        error: (err) => console.error('Failed to load account details', err)
      });
    }
  }

  protected readonly sampleForm: FormGroup = this.fb.group({
    sampleName: ['', Validators.required],
    packagingHeight: [''],
    packagingWidth: [''],
    packagingMaterial: [''],
    costContent: ['', Validators.required],
    costCurrency: ['EUR', Validators.required],
    dueDate: ['', Validators.required],
    hazardous: [false],
    hazardousReason: [''],
    numberOfSamplesContent: ['', Validators.required],
    numberOfSamplesUom: ['EA', Validators.required],
    sampleType: ['WITHPACKAGING', Validators.required],
    shipToAddress: ['', Validators.required],
    status: ['OPEN', Validators.required],
    accountId: ['', Validators.required],
    productId: ['', Validators.required],
    employeeId: ['', Validators.required],
    serviceCaseId: [''],
    opportunityId: ['']
  });

  constructor() {
    effect(() => {
      const currentSample = this.sample();
      if (currentSample && this.isOpen()) {
        this.populateForm(currentSample);
      }
    });
  }

  open() {
    this.isOpen.set(true);
    this.errorMessage.set(null);
    const currentSample = this.sample();
    if (currentSample) {
      this.populateForm(currentSample);
    }
    this.loadCrmEntities();
  }

  private loadCrmEntities() {
    this.crmService.getOpportunities().subscribe({
      next: (data) => {
        this.opportunities.set(data.map(o => ({
          id: o.id,
          displayName: o.name,
          displayId: o.displayId
        })));
      },
      error: (err) => console.error('Failed to load opportunities', err)
    });

    this.crmService.getAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data.map(a => ({
          id: a.id,
          displayName: a.formattedName,
          displayId: a.displayId
        })));
      },
      error: (err) => console.error('Failed to load accounts', err)
    });

    this.crmService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data.map(p => ({
          id: p.id,
          displayName: p.name,
          displayId: p.displayId
        })));
      },
      error: (err) => console.error('Failed to load products', err)
    });

    this.crmService.getEmployees().subscribe({
      next: (data) => {
        this.employees.set(data.map(e => ({
          id: e.id,
          displayName: e.formattedName,
          displayId: e.displayId
        })));
      },
      error: (err) => console.error('Failed to load employees', err)
    });

    this.crmService.getServiceCases().subscribe({
      next: (data) => {
        this.serviceCases.set(data.map(s => ({
          id: s.id,
          displayName: s.subject,
          displayId: s.displayId
        })));
      },
      error: (err) => console.error('Failed to load service cases', err)
    });
  }

  close() {
    this.isOpen.set(false);
    this.modalClosed.emit();
  }

  private populateForm(sample: Sample) {
    this.sampleForm.patchValue({
      sampleName: sample.sampleName,
      packagingHeight: sample.packagingHeight || '',
      packagingWidth: sample.packagingWidth || '',
      packagingMaterial: sample.packagingMaterial || '',
      costContent: sample.costOfSample?.content || '',
      costCurrency: sample.costOfSample?.currencyCode || 'EUR',
      dueDate: sample.dueDate,
      hazardous: sample.hazardous,
      hazardousReason: sample.hazardousReason || '',
      numberOfSamplesContent: sample.numberOfSamples?.content || '',
      numberOfSamplesUom: sample.numberOfSamples?.uomCode || 'EA',
      sampleType: sample.sampleType,
      shipToAddress: sample.shipToAddress,
      status: sample.status,
      accountId: sample.account?.accountId || '',
      productId: sample.product?.productId || '',
      employeeId: sample.employee?.employeeId || '',
      serviceCaseId: sample.serviceCase?.serviceCaseId || '',
      opportunityId: sample.opportunity?.opportunityId || ''
    });
  }

  protected onSubmit() {
    const currentSample = this.sample();
    if (this.sampleForm.invalid || !currentSample?.id) {
      this.sampleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.sampleForm.value;
    const payload: CreateSamplePayload = {
      sampleName: formValue.sampleName,
      packagingHeight: formValue.packagingHeight || undefined,
      packagingWidth: formValue.packagingWidth || undefined,
      packagingMaterial: formValue.packagingMaterial || undefined,
      costOfSample: {
        content: formValue.costContent,
        currencyCode: formValue.costCurrency
      },
      dueDate: formValue.dueDate,
      hazardous: formValue.hazardous,
      hazardousReason: formValue.hazardousReason || undefined,
      numberOfSamples: {
        content: formValue.numberOfSamplesContent,
        uomCode: formValue.numberOfSamplesUom
      },
      sampleType: formValue.sampleType,
      shipToAddress: formValue.shipToAddress,
      status: formValue.status,
      account: {
        accountId: formValue.accountId
      },
      product: {
        productId: formValue.productId
      },
      employee: {
        employeeId: formValue.employeeId
      }
    };

    if (formValue.serviceCaseId) {
      payload.serviceCase = { serviceCaseId: formValue.serviceCaseId };
    }

    if (formValue.opportunityId) {
      payload.opportunity = { opportunityId: formValue.opportunityId };
    }

    this.sampleService.updateSample(currentSample.id, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.sampleUpdated.emit();
        this.close();
      },
      error: (error: Error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.message || 'Failed to update sample');
      }
    });
  }
}
