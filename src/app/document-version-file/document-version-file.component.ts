import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import {DocumentVersionService} from "../service/document-version.service";
import {DocumentService} from "../service/document.service";
import {AuthenticationService} from "../service/authentication.service";
import {ActivatedRoute} from "@angular/router";
import * as fileSaver from 'file-saver';
import * as rangy from '@rangy/core';
import * as rangyS from '@rangy/serializer';
import * as rangyH from '@rangy/highlighter';
import * as rangyC from '@rangy/classapplier';
import {Comment} from "../model/comment";
import {CommentService} from "../service/comment.service";

@Component({
  selector: 'app-document-version-file',
  templateUrl: './document-version-file.component.html',
  styleUrls: ['./document-version-file.component.scss']
})
export class DocumentVersionFileComponent implements OnInit {

  version: DocumentVersion;
  file: Object;
  fileURL: String;
  comments: Array<Comment>;

  page: number = 1;
  totalPages: number;
  pageRenderes: number = 0;
  isLoaded: boolean = false;
  inRendering: boolean = true;
  currentComment: Comment;
  newComment: Comment;
  canDeleteCurrentComment: boolean = false;
  error = '';
  highlighter = rangyH.createHighlighter();

  constructor(private documentVersionService: DocumentVersionService,
              private commentService: CommentService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.inRendering = true;

    this.route.params.subscribe(params => {
      let documentVersionId = params['id'];
      this.documentVersionService.findById(documentVersionId).subscribe(version => {
        this.version = version;
        this.commentService.findByVersion(version).subscribe(comments => {
          this.version.comments = comments;
        });
        this.documentVersionService.getFile(version).subscribe(data => {
          this.file = new Blob([data.body], {type: 'application/pdf'});
          this.fileURL = URL.createObjectURL(this.file);
        });
      });
    });

    //fake backend
    //this.fileURL = '/assets/test.pdf';
    //this.version.comments = [{id:'1', createdDate: new Date(), text: 'My comment', selection: '0/54/1/0/0/0/2/0/0/2/0/0/1/1/2:0,0/54/1/0/0/0/2/0/0/2/0/0/1/1/2:1', toText: 'for this text'}];
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  textLayerRendered(e: CustomEvent) {
    this.pageRenderes++;
    if (this.pageRenderes === this.totalPages) {
      let self = this;
      this.version.comments.forEach(function(comment) {
        self.highlightComment(comment);
        rangy.getSelection().collapseToStart();
      });
      this.inRendering = false;
    }
  }

  highlightComment(comment: Comment) {
    let self = this;
    let options = {'exclusive': true};

    let myLocalFunction = function () {
      self.setCurrentComment(comment);
    };
    if (rangyS.canDeserializeSelection(comment.selection)) {
      rangyS.deserializeSelection(comment.selection);
      this.highlighter.addClassApplier(rangyC.createClassApplier("bg-warning", {
        ignoreWhiteSpace: true,
        elementProperties: {
          commentId: comment.id,
          onclick: function (e) {
            myLocalFunction();
          }
        }
      }));
      comment.highlights = this.highlighter.highlightSelection('bg-warning', options);
    } else {
      console.log('Error: can not deserialize comment #' + comment.id);
    }
  }

  setCurrentComment(comment: Comment) {
    this.currentComment = comment;
    if (comment.owner.id == this.authenticationService.currentUserValue.id) {
      this.canDeleteCurrentComment = true;
    } else {
      this.canDeleteCurrentComment = false;
    }
  }

  mouseEvent(e: MouseEvent) {
    let rangySelection = rangy.getSelection();
    let text = rangySelection.toString();


    if (text != '') {
      this.newComment = new Comment();
      this.newComment.owner = this.authenticationService.currentUserValue;
      this.newComment.version = this.version;

      this.newComment.toText = text;
      this.newComment.selection = rangyS.serializeSelection(rangySelection, true);
    }
  }

  //TODO
  addScore() {
    console.log('add score');
  }

  download() {
    fileSaver.saveAs(this.file, this.version.document.name);
  }

  saveComment() {
    if (this.newComment) {
      this.commentService.save(this.newComment).subscribe(result => {
        this.newComment = result;
        this.highlightComment(this.newComment);
        this.version.comments.push(this.newComment);
        this.newComment = undefined;
      });
    } else {
      this.error = 'Please choose text to comment.';
    }
  }

  delete() {
    if (this.currentComment) {
      this.commentService.delete(this.currentComment.id).subscribe(result => {
        this.highlighter.removeHighlights(this.currentComment.highlights);
        this.currentComment = undefined;
        this.canDeleteCurrentComment = false;
      });
    }
  }

}
