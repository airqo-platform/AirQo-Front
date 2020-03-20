<!-- cards section -->
<div class="buzen-card-section from-top" id="buzen-card-section">
     <div class="container">
          <div class="row">

			<div class="buzen-header" style="margin-top: 15px; padding-left: 15px; padding-right: 15px;">
				<div class="buzen-header">
					<div class="row">
						<h4><b>Meet the team</b></h4>
						<h5>We work with a diversified team of experts to ensure that we provide you with the best air quality data.</h5>
					</div>
				</div>
			</div>
			<div class="buzen-current-projects all-projects">
				<div class="container">
					<div class="project-big-tile">
						<div class="myrow">
							<div class="row row-centered">
								<?php
								$modal = '';
								foreach ($team as $row) {
									?>
									<div class="col-md-3">
										<div class="card" style="padding-bottom: 2em; min-height: 420px;">
											<a href="#" data-toggle="modal" data-target=".member<?= $row['team_id']; ?>" data-id="<?= $row['team_id']; ?>"><img src="<?= $row['team_image']; ?>" class="thumbnail" width="250" height="250" style="object-fit: cover;" alt=""></a>
											<div class="card-body">
												<h5 class="card-title"><b><?= $row['team_name']; ?></b></h5>
												<p class="card-text"><?= $row['team_title']; ?></p>
												<!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
											</div>
										</div>
									</div>
									
									<!-- <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12">
						<a href="#" data-toggle="modal" data-target=".member<?= $row['team_id']; ?>" data-id="<?= $row['team_id']; ?>">
						<div class="image-section">
							<img src="<?= base_url(); ?>assets/images/team/<?= $row['team_image']; ?>" width="100%" height="250px" />
						</div>
							<div class="text-section">
							<h4>Name: <b style="color: #3399CC"><?= $row['team_name']; ?></b></h4>
							<h5>Title: <b style="color: #3399CC"><?= $row['team_title']; ?></b></h5>
							</div>
						</a>
					</div> -->
									<?php $modal .= '
										<div class="modal myModal member' . $row['team_id'] . ' fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="width:100%;">
											<div class="modal-dialog" role="document">
											<div class="modal-content">
												<div class="modal-header">
												<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span class="video-close" aria-hidden="true" >&times;</span>
												</button>
												</div>
												<div class="modal-body" style="padding:1px; border-radius:0px;">
												<div>
													<img src="' . $row['team_image'] . '" style="width:100%; height:450px; object-fit:cover;">
												</div>
												<div class="text-section">
													<table class="table table-striped">
														<tr>
															<th>Name</th>
															<td>' . $row['team_name'] . '</td>
														</tr>
														<tr>
															<th>Title</th>
															<td>' . $row['team_title'] . '</td>
														</tr>
														<tr>
															<th>Email</th>
															<td>' . $row['team_emailAddress'] . '</td>
														</tr>
														
														<tr>
															<th>Profile Information</th>
															<td>' . $row['team_otherAddress'] . '</td>
														</tr>
													</table>
												</div>
												</div>
											</div>
											</div>
										</div>';
										?>
								<?php } ?>
							</div>
						</div>
					</div>
				</div>
			</div>
			<?= $modal; ?>

		</div>
	</div>
</div>