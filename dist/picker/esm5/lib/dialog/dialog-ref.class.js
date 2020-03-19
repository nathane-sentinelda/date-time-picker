import { ESCAPE } from '@angular/cdk/keycodes';
import { Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
var OwlDialogRef = /** @class */ (function () {
    function OwlDialogRef(overlayRef, container, id, location) {
        var _this = this;
        this.overlayRef = overlayRef;
        this.container = container;
        this.id = id;
        this._beforeClose$ = new Subject();
        this._afterOpen$ = new Subject();
        this._afterClosed$ = new Subject();
        /** Subscription to changes in the user's location. */
        this.locationChanged = Subscription.EMPTY;
        /** Whether the user is allowed to close the dialog. */
        this.disableClose = this.container.config.disableClose;
        this.container.animationStateChanged
            .pipe(filter(function (event) { return event.phaseName === 'done' && event.toState === 'enter'; }), take(1))
            .subscribe(function () {
            _this._afterOpen$.next();
            _this._afterOpen$.complete();
        });
        this.container.animationStateChanged
            .pipe(filter(function (event) { return event.phaseName === 'done' && event.toState === 'exit'; }), take(1))
            .subscribe(function () {
            _this.overlayRef.dispose();
            _this.locationChanged.unsubscribe();
            _this._afterClosed$.next(_this.result);
            _this._afterClosed$.complete();
            _this.componentInstance = null;
        });
        this.overlayRef.keydownEvents()
            .pipe(filter(function (event) { return event.keyCode === ESCAPE && !_this.disableClose; }))
            .subscribe(function () { return _this.close(); });
        if (location) {
            this.locationChanged = location.subscribe(function () {
                if (_this.container.config.closeOnNavigation) {
                    _this.close();
                }
            });
        }
    }
    OwlDialogRef.prototype.close = function (dialogResult) {
        var _this = this;
        this.result = dialogResult;
        this.container.animationStateChanged
            .pipe(filter(function (event) { return event.phaseName === 'start'; }), take(1))
            .subscribe(function () {
            _this._beforeClose$.next(dialogResult);
            _this._beforeClose$.complete();
            _this.overlayRef.detachBackdrop();
        });
        this.container.startExitAnimation();
    };
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    OwlDialogRef.prototype.backdropClick = function () {
        return this.overlayRef.backdropClick();
    };
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    OwlDialogRef.prototype.keydownEvents = function () {
        return this.overlayRef.keydownEvents();
    };
    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    OwlDialogRef.prototype.updatePosition = function (position) {
        var strategy = this.getPositionStrategy();
        if (position && (position.left || position.right)) {
            position.left ? strategy.left(position.left) : strategy.right(position.right);
        }
        else {
            strategy.centerHorizontally();
        }
        if (position && (position.top || position.bottom)) {
            position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        }
        else {
            strategy.centerVertically();
        }
        this.overlayRef.updatePosition();
        return this;
    };
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    OwlDialogRef.prototype.updateSize = function (width, height) {
        if (width === void 0) { width = 'auto'; }
        if (height === void 0) { height = 'auto'; }
        this.getPositionStrategy().width(width).height(height);
        this.overlayRef.updatePosition();
        return this;
    };
    OwlDialogRef.prototype.isAnimating = function () {
        return this.container.isAnimating;
    };
    OwlDialogRef.prototype.afterOpen = function () {
        return this._afterOpen$.asObservable();
    };
    OwlDialogRef.prototype.beforeClose = function () {
        return this._beforeClose$.asObservable();
    };
    OwlDialogRef.prototype.afterClosed = function () {
        return this._afterClosed$.asObservable();
    };
    /** Fetches the position strategy object from the overlay ref. */
    OwlDialogRef.prototype.getPositionStrategy = function () {
        return this.overlayRef.getConfig().positionStrategy;
    };
    return OwlDialogRef;
}());
export { OwlDialogRef };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLXBpY2stZGF0ZXRpbWUvIiwic291cmNlcyI6WyJsaWIvZGlhbG9nL2RpYWxvZy1yZWYuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRy9DLE9BQU8sRUFBYyxPQUFPLEVBQUUsWUFBWSxFQUFxQyxNQUFNLE1BQU0sQ0FBQztBQUM1RixPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDO0lBcUJJLHNCQUFxQixVQUFzQixFQUN0QixTQUFzQyxFQUM5QixFQUFVLEVBQzFCLFFBQW1CO1FBSGhDLGlCQXVDQztRQXZDb0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixjQUFTLEdBQVQsU0FBUyxDQUE2QjtRQUM5QixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBbkIvQixrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFFbkMsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBRWpDLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUUzQyxzREFBc0Q7UUFDOUMsb0JBQWUsR0FBa0IsWUFBWSxDQUFDLEtBQUssQ0FBQztRQU81RCx1REFBdUQ7UUFDaEQsaUJBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFPckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUI7YUFDL0IsSUFBSSxDQUNELE1BQU0sQ0FBQyxVQUFFLEtBQXFCLElBQU0sT0FBQSxLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBdkQsQ0FBdUQsQ0FBQyxFQUM1RixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQ1Y7YUFDQSxTQUFTLENBQUM7WUFDUCxLQUFJLENBQUMsV0FBVyxD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QWxCO1FBQ0ksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxpRUFBaUU7SUFDekQsMENBQW1CLEdBQTNCO1FBQ0ksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLGdCQUEwQyxDQUFDO0lBQ2xGLENBQUM7SUFDTCxtQkFBQztBQUFELENBQUMsQUFwSkQsSUFvSkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogZGlhbG9nLXJlZi5jbGFzc1xyXG4gKi9cclxuaW1wb3J0IHsgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBHbG9iYWxQb3NpdGlvblN0cmF0ZWd5LCBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xyXG5pbXBvcnQgeyBFU0NBUEUgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xyXG5pbXBvcnQgeyBPd2xEaWFsb2dDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGlhbG9nUG9zaXRpb24gfSBmcm9tICcuL2RpYWxvZy1jb25maWcuY2xhc3MnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24sIFN1YnNjcmlwdGlvbkxpa2UgYXMgSVN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBmaWx0ZXIsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgY2xhc3MgT3dsRGlhbG9nUmVmPFQ+IHtcclxuXHJcbiAgICBwcml2YXRlIHJlc3VsdDogYW55O1xyXG5cclxuICAgIHByaXZhdGUgX2JlZm9yZUNsb3NlJCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICBwcml2YXRlIF9hZnRlck9wZW4kID0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG5cclxuICAgIHByaXZhdGUgX2FmdGVyQ2xvc2VkJCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICAvKiogU3Vic2NyaXB0aW9uIHRvIGNoYW5nZXMgaW4gdGhlIHVzZXIncyBsb2NhdGlvbi4gKi9cclxuICAgIHByaXZhdGUgbG9jYXRpb25DaGFuZ2VkOiBJU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGluc3RhbmNlIG9mIGNvbXBvbmVudCBvcGVuZWQgaW50byBtb2RhbFxyXG4gICAgICogKi9cclxuICAgIHB1YmxpYyBjb21wb25lbnRJbnN0YW5jZTogVDtcclxuXHJcbiAgICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBhbGxvd2VkIHRvIGNsb3NlIHRoZSBkaWFsb2cuICovXHJcbiAgICBwdWJsaWMgZGlzYWJsZUNsb3NlID0gdGhpcy5jb250YWluZXIuY29uZmlnLmRpc2FibGVDbG9zZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxyXG4gICAgICAgICAgICAgICAgIHByaXZhdGUgY29udGFpbmVyOiBPd2xEaWFsb2dDb250YWluZXJDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgbG9jYXRpb24/OiBMb2NhdGlvbiApIHtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYW5pbWF0aW9uU3RhdGVDaGFuZ2VkXHJcbiAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyKCggZXZlbnQ6IEFuaW1hdGlvbkV2ZW50ICkgPT4gZXZlbnQucGhhc2VOYW1lID09PSAnZG9uZScgJiYgZXZlbnQudG9TdGF0ZSA9PT0gJ2VudGVyJyksXHJcbiAgICAgICAgICAgICAgICB0YWtlKDEpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hZnRlck9wZW4kLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FmdGVyT3BlbiQuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFuaW1hdGlvblN0YXRlQ2hhbmdlZFxyXG4gICAgICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgICAgIGZpbHRlcigoIGV2ZW50OiBBbmltYXRpb25FdmVudCApID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ2RvbmUnICYmIGV2ZW50LnRvU3RhdGUgPT09ICdleGl0JyksXHJcbiAgICAgICAgICAgICAgICB0YWtlKDEpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlSZWYuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhdGlvbkNoYW5nZWQudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FmdGVyQ2xvc2VkJC5uZXh0KHRoaXMucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FmdGVyQ2xvc2VkJC5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IG51bGwhO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vdmVybGF5UmVmLmtleWRvd25FdmVudHMoKVxyXG4gICAgICAgICAgICAucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICF0aGlzLmRpc2FibGVDbG9zZSkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcclxuXHJcbiAgICAgICAgaWYgKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYXRpb25DaGFuZ2VkID0gbG9jYXRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5jb25maWcuY2xvc2VPbk5hdmlnYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoIGRpYWxvZ1Jlc3VsdD86IGFueSApIHtcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IGRpYWxvZ1Jlc3VsdDtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYW5pbWF0aW9uU3RhdGVDaGFuZ2VkXHJcbiAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyKCggZXZlbnQ6IEFuaW1hdGlvbkV2ZW50ICkgPT4gZXZlbnQucGhhc2VOYW1lID09PSAnc3RhcnQnKSxcclxuICAgICAgICAgICAgICAgIHRha2UoMSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2JlZm9yZUNsb3NlJC5uZXh0KGRpYWxvZ1Jlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iZWZvcmVDbG9zZSQuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3ZlcmxheVJlZi5kZXRhY2hCYWNrZHJvcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3RhcnRFeGl0QW5pbWF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBvdmVybGF5J3MgYmFja2Ryb3AgaGFzIGJlZW4gY2xpY2tlZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGJhY2tkcm9wQ2xpY2soKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4ga2V5ZG93biBldmVudHMgYXJlIHRhcmdldGVkIG9uIHRoZSBvdmVybGF5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMga2V5ZG93bkV2ZW50cygpOiBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vdmVybGF5UmVmLmtleWRvd25FdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgdGhlIGRpYWxvZydzIHBvc2l0aW9uLlxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIE5ldyBkaWFsb2cgcG9zaXRpb24uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVQb3NpdGlvbiggcG9zaXRpb24/OiBEaWFsb2dQb3NpdGlvbiApOiB0aGlzIHtcclxuICAgICAgICBsZXQgc3RyYXRlZ3kgPSB0aGlzLmdldFBvc2l0aW9uU3RyYXRlZ3koKTtcclxuXHJcbiAgICAgICAgaWYgKHBvc2l0aW9uICYmIChwb3NpdGlvbi5sZWZ0IHx8IHBvc2l0aW9uLnJpZ2h0KSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbi5sZWZ0ID8gc3RyYXRlZ3kubGVmdChwb3NpdGlvbi5sZWZ0KSA6IHN0cmF0ZWd5LnJpZ2h0KHBvc2l0aW9uLnJpZ2h0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdHJhdGVneS5jZW50ZXJIb3Jpem9udGFsbHkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwb3NpdGlvbiAmJiAocG9zaXRpb24udG9wIHx8IHBvc2l0aW9uLmJvdHRvbSkpIHtcclxuICAgICAgICAgICAgcG9zaXRpb24udG9wID8gc3RyYXRlZ3kudG9wKHBvc2l0aW9uLnRvcCkgOiBzdHJhdGVneS5ib3R0b20ocG9zaXRpb24uYm90dG9tKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdHJhdGVneS5jZW50ZXJWZXJ0aWNhbGx5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIHRoZSBkaWFsb2cncyB3aWR0aCBhbmQgaGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIHdpZHRoIE5ldyB3aWR0aCBvZiB0aGUgZGlhbG9nLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBOZXcgaGVpZ2h0IG9mIHRoZSBkaWFsb2cuXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZVNpemUoIHdpZHRoOiBzdHJpbmcgPSAnYXV0bycsIGhlaWdodDogc3RyaW5nID0gJ2F1dG8nICk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuZ2V0UG9zaXRpb25TdHJhdGVneSgpLndpZHRoKHdpZHRoKS5oZWlnaHQoaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNBbmltYXRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmlzQW5pbWF0aW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZnRlck9wZW4oKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWZ0ZXJPcGVuJC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmVmb3JlQ2xvc2UoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmVmb3JlQ2xvc2UkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZnRlckNsb3NlZCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hZnRlckNsb3NlZCQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEZldGNoZXMgdGhlIHBvc2l0aW9uIHN0cmF0ZWd5IG9iamVjdCBmcm9tIHRoZSBvdmVybGF5IHJlZi4gKi9cclxuICAgIHByaXZhdGUgZ2V0UG9zaXRpb25TdHJhdGVneSgpOiBHbG9iYWxQb3NpdGlvblN0cmF0ZWd5IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vdmVybGF5UmVmLmdldENvbmZpZygpLnBvc2l0aW9uU3RyYXRlZ3kgYXMgR2xvYmFsUG9zaXRpb25TdHJhdGVneTtcclxuICAgIH1cclxufVxyXG4iXX0=