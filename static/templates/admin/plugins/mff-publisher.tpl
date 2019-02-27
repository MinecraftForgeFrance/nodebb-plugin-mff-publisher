<form role="form" class="mff-publisher-settings">
	<div class="row">
		<div class="col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">MFF Publisher settings</div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-lg-6 col-xs-12">
                            <div class="form-group">
                                <label for="discordwebhook">
                                    Discord WebHook url (keep it secret)
                                </label>
                                <input class="form-control" placeholder="https://discordapp.com/api/webhooks/..." type="text" name="discordwebhook" id="discordwebhook" />
                            </div>
                        </div>
                        <div class="col-lg-6 col-xs-12">
                            <div class="form-group">
                                <label for="publishcategoryid">
                                    Publish category id
                                </label>
                                <input class="form-control" type="number" name="publishcategoryid" id="publishcategoryid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
