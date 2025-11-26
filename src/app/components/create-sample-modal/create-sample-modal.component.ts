import { ChangeDetectionStrategy, Component, output, signal, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SampleService } from '../../services/sample.service';
import { CrmService } from '../../services/crm.service';
import { CreateSamplePayload } from '../../models/sample.model';
import { CommonModule } from '@angular/common';
import { EntitySelectorComponent, SelectableEntity } from '../entity-selector/entity-selector.component';
import { CodeSelectorComponent, SelectOption } from '../code-selector/code-selector.component';
import { CURRENCIES, UNITS_OF_MEASURE } from '../../models/reference-data.model';

@Component({
  selector: 'app-create-sample-modal',
  templateUrl: './create-sample-modal.component.html',
  styleUrl: './create-sample-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, EntitySelectorComponent, CodeSelectorComponent]
})
export class CreateSampleModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly sampleService = inject(SampleService);
  private readonly crmService = inject(CrmService);

  protected readonly isOpen = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly opportunityContext = signal<{ opportunityId: string; accountId: string; productIds: string[] } | null>(null);
  
  // CRM Entity Lists
  protected readonly opportunities = signal<SelectableEntity[]>([]);
  protected readonly accounts = signal<SelectableEntity[]>([]);
  protected readonly products = signal<SelectableEntity[]>([]);
  protected readonly allProducts = signal<SelectableEntity[]>([]);
  protected readonly employees = signal<SelectableEntity[]>([]);
  protected readonly serviceCases = signal<SelectableEntity[]>([]);
  
  // Reference data
  protected readonly currencies: SelectOption[] = CURRENCIES;
  protected readonly unitsOfMeasure: SelectOption[] = UNITS_OF_MEASURE;

  readonly sampleCreated = output<void>();
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
    costContent: [''],
    costCurrency: ['EUR'],
    dueDate: ['', Validators.required],
    hazardous: [false],
    hazardousReason: [''],
    numberOfSamplesContent: [''],
    numberOfSamplesUom: ['EA'],
    sampleType: ['WITHPACKAGING'],
    shipToAddress: [''],
    status: ['OPEN'],
    accountId: [''],
    productId: [''],
    employeeId: [''],
    serviceCaseId: [''],
    opportunityId: ['']
  });

  open(opportunityId?: string) {
    this.isOpen.set(true);
    this.sampleForm.reset({
      costCurrency: 'EUR',
      sampleType: 'WITHPACKAGING',
      status: 'OPEN',
      numberOfSamplesUom: 'EA',
      hazardous: false
    });
    this.errorMessage.set(null);
    this.opportunityContext.set(null);
    
    if (opportunityId) {
      this.loadOpportunityContext(opportunityId);
    } else {
      this.loadCrmEntities();
    }
  }

  private loadOpportunityContext(opportunityId: string) {
    this.crmService.getOpportunityById(opportunityId).subscribe({
      next: (opportunity) => {
        console.log('Opportunity data received:', opportunity);
        
        // Handle both response formats: direct object or wrapped in .value
        const oppData = opportunity?.value || opportunity;
        
        if (oppData) {
          const accountId = oppData.account?.id;
          const items = oppData.items || [];
          const productIds = items
            .filter((item: any) => item.productId)
            .map((item: any) => item.productId);
          
          // Remove duplicates
          const uniqueProductIds = [...new Set(productIds)] as string[];
          
          console.log('Account ID:', accountId);
          console.log('Product IDs:', uniqueProductIds);
          
          this.opportunityContext.set({ opportunityId, accountId, productIds: uniqueProductIds });
          
          // Pre-fill the form immediately with the IDs from opportunity
          this.sampleForm.patchValue({
            accountId: accountId,
            opportunityId: opportunityId
          });
          
          // Build product list from opportunity items
          if (uniqueProductIds.length > 0) {
            const opportunityProducts: SelectableEntity[] = items
              .filter((item: any) => item.productId)
              .map((item: any) => ({
                id: item.productId,
                displayName: item.productDescription || 'Product',
                displayId: item.productDisplayId || ''
              }))
              .filter((p: SelectableEntity, index: number, self: SelectableEntity[]) => 
                self.findIndex(t => t.id === p.id) === index
              );
            
            console.log('Setting products from opportunity:', opportunityProducts);
            this.products.set(opportunityProducts);
          }
          
          // Load account details for address
          if (accountId) {
            this.crmService.getAccountById(accountId).subscribe({
              next: (account) => {
                console.log('Account details loaded:', account);
                if (account?.defaultAddress?.formattedPostalAddressDescription) {
                  this.sampleForm.patchValue({
                    shipToAddress: account.defaultAddress.formattedPostalAddressDescription
                  });
                }
              },
              error: (err) => console.error('Failed to load account details', err)
            });
          }
          
          // Still load the full lists for other fields
          this.loadCrmEntitiesForContext(oppData);
        } else {
          console.error('No opportunity data found');
          this.loadCrmEntities();
        }
      },
      error: (err) => {
        console.error('Failed to load opportunity context', err);
        this.loadCrmEntities();
      }
    });
  }

  private loadCrmEntitiesForContext(currentOpportunity?: any) {
    // Load opportunities, accounts (for display), employees, and service cases
    // But don't override the products or form values
    this.crmService.getOpportunities().subscribe({
      next: (data) => {
        const opportunities = data.map(o => ({
          id: o.id,
          displayName: o.name,
          displayId: o.displayId
        }));
        
        // Add the current opportunity if it's not in the list
        if (currentOpportunity && !opportunities.find(o => o.id === currentOpportunity.id)) {
          opportunities.unshift({
            id: currentOpportunity.id,
            displayName: currentOpportunity.name || currentOpportunity.displayId || currentOpportunity.id,
            displayId: currentOpportunity.displayId || ''
          });
        }
        
        this.opportunities.set(opportunities);
      },
      error: (err) => console.error('Failed to load opportunities', err)
    });

    this.crmService.getAccounts().subscribe({
      next: (data) => {
        const accounts = data.map(a => ({
          id: a.id,
          displayName: a.formattedName,
          displayId: a.displayId
        }));
        
        // Add the current account if it's not in the list
        if (currentOpportunity?.account && !accounts.find(a => a.id === currentOpportunity.account.id)) {
          accounts.unshift({
            id: currentOpportunity.account.id,
            displayName: currentOpportunity.account.formattedName || currentOpportunity.account.displayId || currentOpportunity.account.id,
            displayId: currentOpportunity.account.displayId || ''
          });
        }
        
        this.accounts.set(accounts);
      },
      error: (err) => console.error('Failed to load accounts', err)
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
        const prods = data.map(p => ({
          id: p.id,
          displayName: p.name,
          displayId: p.displayId
        }));
        this.allProducts.set(prods);
        this.products.set(prods);
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

  protected onSubmit() {
    if (this.sampleForm.invalid) {
      this.sampleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.sampleForm.value;
    const payload: Partial<CreateSamplePayload> = {
      sampleName: formValue.sampleName,
      dueDate: formValue.dueDate,
      status: formValue.status,
      sampleType: formValue.sampleType,
      hazardous: formValue.hazardous
    };

    if (formValue.packagingHeight) payload.packagingHeight = formValue.packagingHeight;
    if (formValue.packagingWidth) payload.packagingWidth = formValue.packagingWidth;
    if (formValue.packagingMaterial) payload.packagingMaterial = formValue.packagingMaterial;
    if (formValue.hazardousReason) payload.hazardousReason = formValue.hazardousReason;
    if (formValue.shipToAddress) payload.shipToAddress = formValue.shipToAddress;

    if (formValue.costContent) {
      payload.costOfSample = {
        content: formValue.costContent,
        currencyCode: formValue.costCurrency || 'EUR'
      };
    }

    if (formValue.numberOfSamplesContent) {
      payload.numberOfSamples = {
        content: formValue.numberOfSamplesContent,
        uomCode: formValue.numberOfSamplesUom || 'EA'
      };
    }

    if (formValue.accountId) {
      payload.account = { accountId: formValue.accountId };
    }

    if (formValue.productId) {
      payload.product = { productId: formValue.productId };
    }

    if (formValue.employeeId) {
      payload.employee = { employeeId: formValue.employeeId };
    }

    if (formValue.serviceCaseId) {
      payload.serviceCase = { serviceCaseId: formValue.serviceCaseId };
    }

    if (formValue.opportunityId) {
      payload.opportunity = { opportunityId: formValue.opportunityId };
    }

    this.sampleService.createSample(payload as CreateSamplePayload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.sampleCreated.emit();
        this.close();
      },
      error: (error: Error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.message || 'Failed to create sample');
      }
    });
  }
}
