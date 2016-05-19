<?php

namespace OCA\GumHls\AppInfo;


use \OCP\AppFramework\App;
use \OCP\IContainer;

use \OCA\GumHls\Controller\ApiController;


class Application extends App {


	public function __construct () {
		parent::__construct('gum_hls');

		$container = $this->getContainer();

		/**
		 * Controllers
		 */
                $container->registerService('ApiController', function($c){
                        return new ApiController(
                                $c->query('AppName'),
                                $c->query('Request')
                        );
                });


		/**
		 * Core
		 */
		$container->registerService('UserId', function(IContainer $c) {
			return \OCP\User::getUser();
		});		
		
	}
}
