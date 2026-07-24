import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inbox',
    pathMatch: 'full',
  },
  {
    path: 'inbox',
    loadComponent: () =>
      import('./features/inbox/inbox-list').then((m) => m.InboxList),
    title: 'Inbox',
  },
  {
    path: 'inbox/:wabaId/:from',
    loadComponent: () =>
      import('./features/inbox/conversation-view').then((m) => m.ConversationView),
    title: 'Conversation',
  },
  {
    path: 'connect',
    loadComponent: () =>
      import('./features/whatsapp-connect/whatsapp-connect').then(
        (m) => m.WhatsappConnect,
      ),
    title: 'Connect WhatsApp Business',
  },
  {
    path: 'wabas',
    loadComponent: () =>
      import('./features/wabas/wabas-list').then((m) => m.WabasList),
    title: 'Connected Accounts',
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/events-viewer').then((m) => m.EventsViewer),
    title: 'Webhook Events',
  },
  {
    path: '**',
    redirectTo: 'inbox',
  },
];
