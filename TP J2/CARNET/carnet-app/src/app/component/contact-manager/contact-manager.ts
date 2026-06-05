import { Component, OnInit, inject, signal } from '@angular/core';
import { ContactService } from '../../services/contact';
import { Contact, NouveauContact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-manager',
  imports: [],
  templateUrl: './contact-manager.html',
  styleUrl: './contact-manager.scss',
})
export class ContactManager implements OnInit {
  private service = inject(ContactService);

  contacts = signal<Contact[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  enEdition = signal<Contact | null>(null);

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: (data) => {
        this.contacts.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger (json-server est-il lance sur :3000 ?)');
        this.loading.set(false);
      },
    });
  }

  enregistrer(form: { nom: string; email: string; tel: string }) {
    const edition = this.enEdition();

    if (edition) {
      const maj: Contact = { ...edition, ...form };
      this.service.update(maj).subscribe({
        next: (contactMisAJour) => {
          this.contacts.update((list) =>
            list.map((item) => (item.id === contactMisAJour.id ? contactMisAJour : item)),
          );
          this.annulerEdition();
        },
        error: () => this.error.set('Echec de la modification'),
      });
      return;
    }

    this.service.create(form as NouveauContact).subscribe({
      next: (contactCree) => this.contacts.update((list) => [...list, contactCree]),
      error: () => this.error.set("Echec de l'ajout"),
    });
  }

  editer(contact: Contact) {
    this.enEdition.set(contact);
  }

  annulerEdition() {
    this.enEdition.set(null);
  }

  supprimer(contact: Contact) {
    if (!confirm(`Supprimer ${contact.nom} ?`)) {
      return;
    }

    this.service.delete(contact.id).subscribe({
      next: () => this.contacts.update((list) => list.filter((item) => item.id !== contact.id)),
      error: () => this.error.set('Echec de la suppression'),
    });
  }
}
