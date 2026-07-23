import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WabasService } from './wabas.service';
import { userFacingMessage } from '../../core/errors/app-error';
import type { WabaStatus } from './wabas.types';

@Component({
  selector: 'app-wabas-list',
  imports: [CommonModule],
  templateUrl: './wabas-list.html',
  styleUrl: './wabas-list.css',
})
export class WabasList implements OnInit {
  readonly service = inject(WabasService);

  ngOnInit(): void {
    this.service.load();
  }

  refresh(): void {
    this.service.load();
  }

  errorMessage(): string | null {
    const err = this.service.error();
    return err ? userFacingMessage(err) : null;
  }

  statusSeverity(status: WabaStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'PENDING':
        return 'status-pending';
      case 'ERROR':
        return 'status-error';
    }
  }

  statusLabel(status: WabaStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'PENDING':
        return 'Pending';
      case 'ERROR':
        return 'Error';
    }
  }
}
