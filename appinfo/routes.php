<?php

$this->create('gum_hls_stream_generator', '/php/stream_generator.php')->actionInclude('gum_hls/php/stream_generator.php');

$this->create('gum_hls_stream_cleaner', '/php/stream_cleaner.php')->actionInclude('gum_hls/php/stream_cleaner.php');

$this->create('gum_hls_process_killer', '/php/process_killer.php')->actionInclude('gum_hls/php/process_killer.php');

