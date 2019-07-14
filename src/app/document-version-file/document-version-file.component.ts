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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Score} from "../model/score";
import {FlashMessagesService} from "angular2-flash-messages";
import {FormControl} from "@angular/forms";
import {Tag} from "../model/tag";
import {TagService} from "../service/tag.service";

@Component({
  selector: 'app-document-version-file',
  templateUrl: './document-version-file.component.html',
  styleUrls: ['./document-version-file.component.scss']
})
export class DocumentVersionFileComponent implements OnInit {

  version: DocumentVersion;

  // pdf load and render
  file: Object;
  fileURL: String;
  totalPages: number;
  pageRendered: number = 0;
  isLoaded: boolean = false;
  inRendering: boolean = true;

  // comments render
  comments: Array<Comment>;
  currentComment: Comment;
  newComment: Comment;
  canDeleteCurrentComment: boolean = false;
  highlighter = rangyH.createHighlighter();
  error: String = '';

  // score
  myScoreItem: number;
  scoreItems: number[] = [-3, -2, -1, 0, 1, 2, 3];

  // tags
  tagsFormModal = new FormControl('');
  canAddTag: boolean = false;

  constructor(private documentVersionService: DocumentVersionService,
              private commentService: CommentService,
              private tagService: TagService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private _flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    this.inRendering = true;

    this.route.params.subscribe(params => {
      let documentVersionId = params['id'];
      this.documentVersionService.findById(documentVersionId).subscribe(version => {
        this.version = version;
        this.canAddTag = this.version.document.owner.id == this.authenticationService.currentUserValue.id;
        this.documentVersionService.getScore(this.authenticationService.currentUserValue, this.version.document).subscribe(result => {
          if (result) {
            this.myScoreItem = result.score;
          }
        });
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
    this.pageRendered++;
    if (this.pageRendered === this.totalPages) {
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

  addScore(scoreContent) {
    this.modalService.open(scoreContent, {ariaLabelledBy: 'modal-basic-title', size: 'sm' }).result.then((result) => {
      let score = new Score();
      score.document = this.version.document;
      score.owner = this.authenticationService.currentUserValue;
      score.score = result;
      this.documentVersionService.saveScore(score).subscribe(result => {
        this._flashMessagesService.show('Your score has been successful saved', { cssClass: 'alert-success' });
        this.myScoreItem = score.score;
        }
      );
    });
  }

  addTag(tagContent) {
    this.modalService.open(tagContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      let self = this;
      this.tagsFormModal.value.split(' ').forEach(function (value) {
        let tag = new Tag();
        tag.name = value;
        tag.documents = [self.version.document];
        self.tagService.saveTag(tag).subscribe(result => {
          self._flashMessagesService.show('Your tag ' + tag.name + ' has been successful saved', { cssClass: 'alert-success' });
          }
        );
      });
    });
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
