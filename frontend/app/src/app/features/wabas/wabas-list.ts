import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { WabasService } from './wabas.service';
import { userFacingMessage } from '../../core/errors/app-error';
import type { WabaStatus } from './wabas.types';

type TagSeverity = 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';

@Component({
  selector: 'app-wabas-list',
  imports: [CommonModule, ButtonModule, CardModule, TableModule, TagModule, MessageModule, ProgressSpinnerModule],
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

  statusSeverity(status: WabaStatus): TagSeverity {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warn';
      case 'ERROR': return 'danger';
    }
  }

  statusLabel(status: WabaStatus): string {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'PENDING': return 'Pending';
      case 'ERROR': return 'Error';
    }
  }
}
