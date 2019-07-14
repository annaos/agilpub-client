import { Component, OnInit } from '@angular/core';
import {DocumentService} from "../service/document.service";
import {AuthenticationService} from "../service/authentication.service";
import {DocumentVersionService} from "../service/document-version.service";
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import {ActivatedRoute} from "@angular/router";
import {Tag} from "../model/tag";
import {TagService} from "../service/tag.service";

@Component({
  selector: 'app-document-version-list',
  templateUrl: './document-version-list.component.html',
  styleUrls: ['./document-version-list.component.scss']
})
export class DocumentVersionListComponent implements OnInit {

  document: Document;
  versions: DocumentVersion[];
  canCreateNewVersion: boolean = false;
  deletedTags: Tag[] = [];

  constructor(private documentVersionService: DocumentVersionService,
              private documentService: DocumentService,
              private tagService: TagService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let documentId = params['id']; // (+) converts string 'id' to a number
      this.documentService.findById(documentId).subscribe(document => {
        if (document.owner.id == this.authenticationService.currentUserValue.id) {
          this.canCreateNewVersion = true;
        }
        this.document = document;
        this.documentVersionService.findByDocument(document).subscribe(data => {
          this.versions = data;
        })});
    });
  }

  deleteTag(tag: Tag) {
    this.deletedTags.push(tag);
    this.tagService.deleteTag(tag).subscribe(result => console.log('tag ' + tag.name + ' deleted'));
  }

  isDeleted(tag) {
    return this.deletedTags.find(x => x.id == tag.id) != undefined;
  }

}
