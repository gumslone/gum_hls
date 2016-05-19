<?php
namespace OCA\GumHls\Controller;

//use OCP\AppFramework\Controller;
use OCA\Files\Controller
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\ContentSecurityPolicy;

class ViewController extends Controller {

	public function index() {
		$response = new TemplateResponse('files', 'index');
		$csp = new ContentSecurityPolicy();
		/*$csp->addAllowedImageDomain('*');
		->addAllowedScriptDomain('*');
		->addAllowedStyleDomain('*');
		->addAllowedFontDomain('*');
		->addAllowedImageDomain('*');
		->addAllowedConnectDomain('*');
		->addAllowedMediaDomain('*');*/
		$csp->addAllowedObjectDomain('*');
		//->addAllowedFrameDomain('*');
		//->addAllowedChildSrcDomain('*');
		$response->setContentSecurityPolicy($csp);
	}

}

