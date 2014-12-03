;(function($, scope){
	scope['landing'] = {
		List : {
			dataLeft		: [],
			dataRight		: [],
			iRenderedLeft	: 0,
			iRenderedRight	: 0,
			currentPosLeft	: 0,
			currentPosRight	: 0,
			afterRender		: function(rendered) {},
			listContainer	: {
				Left	: '#js-landing-items-left',
				Right	: '#js-landing-items-right'
			},
			template		: {
				node	: '#tmplNode',
				article	: '#tmplArticle',
				video	: '#tmplVideo',
				album	: '#tmplAlbum',
			},
			addItem : function(item, type) {
				var sPos = 'Left';
				if (scope.landing.List.currentPosLeft > scope.landing.List.currentPosRight)
					sPos = 'Right';
				scope.landing.List[ 'data'+sPos ][ scope.landing.List['data'+sPos].length ] = {
					type: type,
					info: item
				};
				if (type == 'node' || type == 'album')	// type: node, album
					scope.landing.List['currentPos'+sPos] += 2;
				else									// type: article, video
					scope.landing.List['currentPos'+sPos] += 1;
			},
			addItems : function(response) {
				var data = response.data;
				var iNode		= 0,	maxNodes	= data.nodes.length,
					iArticle	= 0,	maxArticles	= data.articles.length,
					iVideo		= 0,	maxVideos	= data.videos.length,
					iAlbum		= 0,	maxAlbums	= data.albums.length;
				var i = 0, total = maxNodes + maxArticles + maxVideos + maxAlbums;
				while (i < total) {
					if (iNode < maxNodes) {
						scope.landing.List.addItem(data.nodes[iNode], 'node');
						iNode++; i++;
					}
					if (i >= total) break;

					if (iArticle < maxArticles) {
						scope.landing.List.addItem(data.articles[iArticle], 'article');
						iArticle++; i++;
					}
					if (i >= total) break;

					if (iVideo < maxVideos) {
						scope.landing.List.addItem(data.videos[iVideo], 'video');
						iVideo++; i++;
					}
					if (i >= total) break;

					if (iNode < maxNodes && iAlbum < maxAlbums) {
						scope.landing.List.addItem(data.nodes[iNode], 'node');
						iNode++; i++;
					}
					if (i >= total) break;

					if (iAlbum < maxAlbums) {
						scope.landing.List.addItem(data.albums[iAlbum], 'album');
						iAlbum++; i++;
					}
					if (i >= total) break;
				}
			},
			render : function() {
				var data;

				var id = 'landing-left-' + (new Date().getTime()) + 'rnd' + Math.round(9999999*Math.random());
				$(scope.landing.List.listContainer.Left).append('<div id="'+id+'"></div>');
				var rendered = $(scope.landing.List.listContainer.Left).find('#'+id);
				while (scope.landing.List.iRenderedLeft < scope.landing.List.dataLeft.length) {
					data = scope.landing.List.dataLeft[scope.landing.List.iRenderedLeft];
					rendered.append(
						$.tmpl($(scope.landing.List.template[data.type]), data.info)
					);
					scope.landing.List.iRenderedLeft++;
				}
				scope.landing.List.afterRender(rendered);

				var id = 'landing-left-' + (new Date().getTime()) + 'rnd' + Math.round(9999999*Math.random());
				$(scope.landing.List.listContainer.Right).append('<div id="'+id+'"></div>');
				var rendered = $(scope.landing.List.listContainer.Right).find('#'+id);
				while (scope.landing.List.iRenderedRight < scope.landing.List.dataRight.length) {
					data = scope.landing.List.dataRight[scope.landing.List.iRenderedRight];
					rendered.append(
						$.tmpl($(scope.landing.List.template[data.type]), data.info)
					);
					scope.landing.List.iRenderedRight++;
				}
				scope.landing.List.afterRender(rendered);
			}
		}
	};
})(jQuery, zone);