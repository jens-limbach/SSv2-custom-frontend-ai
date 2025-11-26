import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SampleService } from '../../services/sample.service';
import { Sample } from '../../models/sample.model';
import { CreateSampleModalComponent } from '../create-sample-modal/create-sample-modal.component';
import { EditSampleModalComponent } from '../edit-sample-modal/edit-sample-modal.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

type SortDirection = 'asc' | 'desc' | null;
type SortableField = 'sampleName' | 'status' | 'dueDate' | 'costOfSample.content' | 'account.name' | 'product.name' | 'employee.name';

@Component({
  selector: 'app-samples-list',
  templateUrl: './samples-list.component.html',
  styleUrl: './samples-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CreateSampleModalComponent, EditSampleModalComponent, DashboardComponent]
})
export class SamplesListComponent {
  private readonly sampleService = inject(SampleService);
  private readonly route = inject(ActivatedRoute);

  protected readonly createModal = viewChild.required(CreateSampleModalComponent);
  protected readonly editModal = viewChild.required(EditSampleModalComponent);

  protected readonly samples = signal<Sample[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly sortField = signal<SortableField | null>(null);
  protected readonly sortDirection = signal<SortDirection>(null);
  protected readonly editingCell = signal<{ id: string; field: string } | null>(null);
  protected readonly editValue = signal<string>('');
  protected readonly sampleToEdit = signal<Sample | null>(null);
  
  // URL parameter filters
  protected readonly filterAccountId = signal<string | null>(null);
  protected readonly filterOpportunityId = signal<string | null>(null);
  
  // Column visibility configuration
  protected readonly showColumnConfigDialog = signal(false);
  protected readonly showDashboard = signal(false);
  protected readonly showQuickCreateMenu = signal(false);
  protected readonly availableColumns = [
    { key: 'sampleName', label: 'Sample Name' },
    { key: 'status', label: 'Status' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'cost', label: 'Cost' },
    { key: 'account', label: 'Account' },
    { key: 'product', label: 'Product' },
    { key: 'employee', label: 'Employee' },
    { key: 'shipTo', label: 'Ship To' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'hazardous', label: 'Hazardous' },
    { key: 'hazardousReason', label: 'Hazardous Reason' },
    { key: 'sampleType', label: 'Sample Type' },
    { key: 'packagingWidth', label: 'Packaging Width' },
    { key: 'packagingHeight', label: 'Packaging Height' },
    { key: 'packagingMaterial', label: 'Packaging Material' },
    { key: 'numberOfSamples', label: 'Number of Samples' },
    { key: 'opportunity', label: 'Opportunity' },
    { key: 'serviceCase', label: 'Service Case' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'modifiedAt', label: 'Modified At' },
    { key: 'modifiedBy', label: 'Modified By' }
  ];
  protected readonly visibleColumns = signal<Set<string>>(new Set([
    'sampleName', 'status', 'dueDate', 'cost', 'account', 'product', 'employee', 'shipTo', 'overdue'
  ]));

  protected readonly filteredAndSortedSamples = computed(() => {
    let result = [...this.samples()];
    
    // Apply URL parameter filters
    const accountIdFilter = this.filterAccountId();
    const opportunityIdFilter = this.filterOpportunityId();
    
    if (accountIdFilter) {
      result = result.filter(sample => sample.account?.accountId === accountIdFilter);
    }
    
    if (opportunityIdFilter) {
      result = result.filter(sample => sample.opportunity?.opportunityId === opportunityIdFilter);
    }
    
    // Filter by search term
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(sample =>
        sample.sampleName?.toLowerCase().includes(term) ||
        sample.status?.toLowerCase().includes(term) ||
        sample.account?.name?.toLowerCase().includes(term) ||
        sample.product?.name?.toLowerCase().includes(term) ||
        sample.employee?.name?.toLowerCase().includes(term)
      );
    }

    // Sort
    const field = this.sortField();
    const direction = this.sortDirection();
    if (field && direction) {
      result.sort((a, b) => {
        let aVal: string | number | undefined;
        let bVal: string | number | undefined;

        if (field === 'costOfSample.content') {
          aVal = parseFloat(a.costOfSample?.content || '0');
          bVal = parseFloat(b.costOfSample?.content || '0');
        } else if (field === 'account.name') {
          aVal = a.account?.name;
          bVal = b.account?.name;
        } else if (field === 'product.name') {
          aVal = a.product?.name;
          bVal = b.product?.name;
        } else if (field === 'employee.name') {
          aVal = a.employee?.name;
          bVal = b.employee?.name;
        } else {
          aVal = a[field as keyof Sample] as string;
          bVal = b[field as keyof Sample] as string;
        }

        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return direction === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        return direction === 'asc' 
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
    }

    return result;
  });

  constructor() {
    // Read URL parameters
    effect(() => {
      this.route.queryParams.subscribe(params => {
        if (params['accountId']) {
          this.filterAccountId.set(params['accountId']);
        }
        if (params['opportunityId']) {
          this.filterOpportunityId.set(params['opportunityId']);
        }
      });
    }, { allowSignalWrites: true });
    
    this.loadSamples();
  }

  protected loadSamples() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.sampleService.getSamples().subscribe({
      next: (response) => {
        this.samples.set(response.value);
        this.isLoading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message || 'Failed to load samples');
        this.isLoading.set(false);
      }
    });
  }

  protected onSort(field: SortableField) {
    if (this.sortField() === field) {
      const currentDirection = this.sortDirection();
      if (currentDirection === 'asc') {
        this.sortDirection.set('desc');
      } else if (currentDirection === 'desc') {
        this.sortDirection.set(null);
        this.sortField.set(null);
      } else {
        this.sortDirection.set('asc');
      }
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  protected getSortIcon(field: SortableField): string {
    if (this.sortField() !== field) return '↕';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  protected openCreateModal() {
    const opportunityId = this.filterOpportunityId();
    this.createModal().open(opportunityId || undefined);
  }

  protected openEditModal(sample: Sample) {
    this.sampleToEdit.set(sample);
    setTimeout(() => this.editModal().open(), 0);
  }

  protected startEditCell(sample: Sample, field: string) {
    this.editingCell.set({ id: sample.id!, field });
    
    let value = '';
    if (field === 'sampleName') value = sample.sampleName || '';
    else if (field === 'status') value = sample.status || '';
    else if (field === 'shipToAddress') value = sample.shipToAddress || '';
    
    this.editValue.set(value);
  }

  protected cancelEdit() {
    this.editingCell.set(null);
    this.editValue.set('');
  }

  protected saveInlineEdit(sample: Sample, field: string) {
    if (!sample.id) return;

    const newValue = this.editValue();
    
    // Create update payload with only changed field
    const updatePayload: Record<string, unknown> = {
      sampleName: sample.sampleName,
      status: sample.status,
      shipToAddress: sample.shipToAddress,
      dueDate: sample.dueDate,
      hazardous: sample.hazardous,
      sampleType: sample.sampleType,
      costOfSample: {
        content: sample.costOfSample.content,
        currencyCode: sample.costOfSample.currencyCode
      },
      numberOfSamples: {
        content: sample.numberOfSamples.content,
        uomCode: sample.numberOfSamples.uomCode
      },
      account: {
        accountId: sample.account.accountId
      },
      product: {
        productId: sample.product.productId
      },
      employee: {
        employeeId: sample.employee.employeeId
      }
    };

    // Update the specific field
    updatePayload[field] = newValue;

    if (sample.hazardousReason) {
      updatePayload['hazardousReason'] = sample.hazardousReason;
    }

    if (sample.packagingMaterial) {
      updatePayload['packagingMaterial'] = sample.packagingMaterial;
    }

    if (sample.packagingHeight) {
      updatePayload['packagingHeight'] = sample.packagingHeight;
    }

    if (sample.packagingWidth) {
      updatePayload['packagingWidth'] = sample.packagingWidth;
    }

    if (sample.serviceCase) {
      updatePayload['serviceCase'] = {
        serviceCaseId: sample.serviceCase.serviceCaseId
      };
    }

    if (sample.opportunity) {
      updatePayload['opportunity'] = {
        opportunityId: sample.opportunity.opportunityId
      };
    }

    this.sampleService.updateSample(sample.id, updatePayload as never).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadSamples();
      },
      error: (error: Error) => {
        alert(`Failed to update: ${error.message}`);
        this.cancelEdit();
      }
    });
  }

  protected deleteSample(sample: Sample) {
    if (!sample.id) return;
    
    if (confirm(`Are you sure you want to delete "${sample.sampleName}"?`)) {
      this.sampleService.deleteSample(sample.id).subscribe({
        next: () => {
          this.loadSamples();
        },
        error: (error: Error) => {
          alert(`Failed to delete: ${error.message}`);
        }
      });
    }
  }

  protected isEditingCell(sampleId: string, field: string): boolean {
    const editing = this.editingCell();
    return editing?.id === sampleId && editing?.field === field;
  }

  protected clearFilters() {
    this.filterAccountId.set(null);
    this.filterOpportunityId.set(null);
  }

  protected hasActiveFilters(): boolean {
    return this.filterAccountId() !== null || this.filterOpportunityId() !== null;
  }
  
  protected openColumnConfig() {
    this.showColumnConfigDialog.set(true);
  }
  
  protected closeColumnConfig() {
    this.showColumnConfigDialog.set(false);
  }
  
  protected toggleDashboard() {
    this.showDashboard.update(show => !show);
  }
  
  protected toggleQuickCreateMenu() {
    this.showQuickCreateMenu.update(show => !show);
  }
  
  protected openOpportunities() {
    const payload = { operation: 'navigation', params: { routingKey: 'guidedselling', viewType: 'list' } };
    window.parent.postMessage(payload, '*');
    this.showQuickCreateMenu.set(false);
  }
  
  protected quickCreateOpportunity() {
    const payload = { operation: 'navigation', params: { routingKey: 'guidedselling', viewType: 'quickcreate' } };
    window.parent.postMessage(payload, '*');
    this.showQuickCreateMenu.set(false);
  }
  
  protected quickCreateSample() {
    const payload = { operation: 'navigation', params: { routingKey: 'customer.ssc.CUS8735', viewType: 'quickcreate' } };
    window.parent.postMessage(payload, '*');
    this.showQuickCreateMenu.set(false);
  }
  
  protected quickCreateProduct() {
    const payload = { operation: 'navigation', params: { routingKey: 'mdproduct', viewType: 'quickcreate' } };
    window.parent.postMessage(payload, '*');
    this.showQuickCreateMenu.set(false);
  }
  
  protected quickCreateAccount() {
    const payload = { operation: 'navigation', params: { routingKey: 'mdaccount', viewType: 'quickcreate' } };
    window.parent.postMessage(payload, '*');
    this.showQuickCreateMenu.set(false);
  }
  
  protected quickCreateCase() {
    const payload = { operation: 'navigation', params: { routingKey: 'case', viewType: 'quickcreate' } };
    window.parent.postMessage(payload, '*');
    this.showQuickCreateMenu.set(false);
  }
  
  protected toggleColumnVisibility(columnKey: string) {
    const columns = new Set(this.visibleColumns());
    if (columns.has(columnKey)) {
      columns.delete(columnKey);
    } else {
      columns.add(columnKey);
    }
    this.visibleColumns.set(columns);
  }
  
  protected isColumnVisible(columnKey: string): boolean {
    return this.visibleColumns().has(columnKey);
  }
  
  protected showAllColumns() {
    this.visibleColumns.set(new Set(this.availableColumns.map(col => col.key)));
  }
  
  protected hideAllColumns() {
    this.visibleColumns.set(new Set(['sampleName'])); // Keep at least sample name visible
  }
  
  // Navigation methods for CRM resources
  protected navigateToSample(sampleId: string) {
    (window as any).navigateToSample(sampleId);
  }
  
  protected navigateToAccount(accountId: string) {
    (window as any).navigateToAccount(accountId);
  }
  
  protected navigateToOpportunity(opportunityId: string) {
    (window as any).navigateToOpportunity(opportunityId);
  }
  
  protected navigateToProduct(productId: string) {
    (window as any).navigateToProduct(productId);
  }
  
  protected navigateToEmployee(employeeId: string) {
    (window as any).navigateToEmployee(employeeId);
  }
  
  protected navigateToServiceCase(serviceCaseId: string) {
    (window as any).navigateToServiceCase(serviceCaseId);
  }
}
