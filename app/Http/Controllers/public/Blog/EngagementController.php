<?php

namespace App\Http\Controllers\public\Blog;

use App\Http\Controllers\Controller;
use App\Models\CommentLike;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\PostLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EngagementController extends Controller
{

    /**
     * Curtir/Descurtir um post
     */
    public function likePost(Request $request, $post)
    {
        try {
            DB::beginTransaction();

            $post = Post::published()->findOrFail($post);
            $user = auth()->user();

            $identifier = $this->getUserIdentifier($request);

            // Verificar se já curtiu
            $existingLike = PostLike::where('post_id', $post->id)
                ->where(function ($query) use ($user, $identifier) {
                    if ($user) {
                        $query->where('user_id', $user->id);
                    } else {
                        $query->where('ip_address', $identifier['ip'])
                            ->orWhere('session_id', $identifier['session_id']);
                    }
                })
                ->first();

            if ($existingLike) {
                // Remover like
                $existingLike->delete();
                $post->incrementColumn('likes', -1);
                $message = 'Like removido com sucesso';
                $liked = false;
            } else {
                // Adicionar like
                PostLike::create([
                    'post_id' => $post->id,
                    'user_id' => $user ? $user->id : null,
                    'ip_address' => $identifier['ip'],
                    'user_agent' => $request->userAgent(),
                    'session_id' => $identifier['session_id'],
                ]);

                $post->incrementColumn('likes', 1);
                $message = 'Post curtido com sucesso';
                $liked = true;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $message,
                'liked' => $liked,
                'likes_count' => $post->fresh()->likes,
                'post_id' => $post->id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar like: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Curtir/Descurtir um comentário
     */
    public function likeComment(Request $request, $post, $comment)
    {
        try {
            DB::beginTransaction();

            $comment = PostComment::approved()->findOrFail($comment);
            $user = auth()->user();

            $identifier = $this->getUserIdentifier($request);

            // Verificar se já curtiu
            $existingLike = CommentLike::where('comment_id', $comment->id)
                ->where(function ($query) use ($user, $identifier) {
                    if ($user) {
                        $query->where('user_id', $user->id);
                    } else {
                        $query->where('ip_address', $identifier['ip'])
                            ->orWhere('session_id', $identifier['session_id']);
                    }
                })
                ->first();

            if ($existingLike) {
                // Remover like
                $existingLike->delete();
                $comment->decrement('likes_count');

                $message = 'Like removido com sucesso';
                $liked = false;
            } else {
                // Adicionar like
                CommentLike::create([
                    'comment_id' => $comment->id,
                    'user_id' => $user ? $user->id : null,
                    'ip_address' => $identifier['ip'],
                    'session_id' => $identifier['session_id'],
                ]);

                $comment->increment('likes_count');
                $message = 'Comentário curtido com sucesso';
                $liked = true;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $message,
                'liked' => $liked,
                'likes_count' => $comment->fresh()->likes_count,
                'comment_id' => $comment->id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar like: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Adicionar um novo comentário
     */
    public function storeComment(Request $request, $postId)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|min:5|max:1000',
            'parent_id' => 'nullable|exists:post_comments,id',
            'author_name' => 'required_if:guest,true|string|max:255',
            'author_email' => 'required_if:guest,true|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $post = Post::findOrFail($postId);
            $user = auth()->user();
            $isGuest = !$user;

            // Verificar se é spam (limite de comentários por IP)
            $ip = $request->ip();
            $cacheKey = 'comment_limit_' . $ip;
            $commentCount = Cache::get($cacheKey, 0);

            if ($commentCount >= 5) {
                return response()->json([
                    'success' => false,
                    'message' => 'Limite de comentários excedido. Tente novamente mais tarde.'
                ], 429);
            }

            $commentData = [
                'post_id' => $postId,
                'user_id' => $user ? $user->id : null,
                'parent_id' => $request->parent_id,
                'content' => $request->content,
                'ip_address' => $ip,
                'user_agent' => $request->userAgent(),
                'status' => $this->getCommentStatus($user),
            ];

            if ($isGuest) {
                $commentData['author_name'] = $request->author_name;
                $commentData['author_email'] = $request->author_email;
                $commentData['status'] = 'approved';
                // Gerar avatar baseado no email (Gravatar style)
                $commentData['author_avatar'] = $this->generateGravatar($request->author_email);
            } else {
                $commentData['author_name'] = $user->name;
                $commentData['author_email'] = $user->email;
                $commentData['author_avatar'] = $user->avatar;
                $commentData['status'] = 'approved'; // Usuários autenticados são aprovados automaticamente
            }

            $comment = PostComment::create($commentData);

            // Se for aprovado automaticamente
            if ($comment->status === 'approved') {
                $comment->update(['approved_at' => now()]);
            }

            // Incrementar contador de respostas se for uma resposta
            if ($request->parent_id) {
                $parentComment = PostComment::find($request->parent_id);
                $parentComment->incrementRepliesCount();
            }

            // Incrementar contador de comentários do post
            if ($comment->status === 'approved') {
                $post->increment('comments_count');
            }

            // Incrementar contador de limite por IP
            Cache::put($cacheKey, $commentCount + 1, 3600); // 1 hora

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $comment->status === 'approved'
                    ? 'Comentário adicionado com sucesso!'
                    : 'Comentário enviado para moderação.',
                'comment' => $comment->load('user', 'replies'),
                'requires_moderation' => $comment->status === 'pending'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erro ao adicionar comentário: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar comentários de um post
     */
    public function getComments($postId, Request $request)
    {
        try {
            $post = Post::findOrFail($postId);

            $comments = PostComment::with(['user', 'replies.user', 'replies.replies.user'])
                ->where('post_id', $postId)
                ->whereNull('parent_id')
                ->approved()
                ->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'comments' => $comments,
                'total_comments' => $post->comments_count
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao carregar comentários: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Editar um comentário
     */
    public function updateComment(Request $request, $commentId)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|min:5|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $comment = PostComment::findOrFail($commentId);
            $user = auth()->user();

            // Verificar permissões
            if (!$user || ($comment->user_id !== $user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não autorizado'
                ], 403);
            }

            $comment->update([
                'content' => $request->content,
                'status' => 'pending' // Re-enviar para moderação se editado
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Comentário atualizado e enviado para moderação',
                'comment' => $comment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar comentário: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Excluir um comentário
     */
    public function deleteComment($commentId)
    {
        try {
            $comment = PostComment::findOrFail($commentId);
            $user = auth()->user();

            // Verificar permissões
            if (!$user || ($comment->user_id !== $user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Não autorizado'
                ], 403);
            }

            DB::beginTransaction();

            // Se for comentário principal, decrementar contador do post
            if ($comment->status === 'approved' && !$comment->parent_id) {
                $comment->post->decrement('comments_count');
            }

            // Se for resposta, decrementar contador do pai
            if ($comment->parent_id) {
                $parentComment = PostComment::find($comment->parent_id);
                $parentComment->decrementRepliesCount();
            }

            $comment->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Comentário excluído com sucesso'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir comentário: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Métodos auxiliares
     */

    private function getUserIdentifier(Request $request): array
    {
        return [
            'ip' => $request->ip(),
            'session_id' => $request->session()->getId()
        ];
    }

    private function getCommentStatus($user): string
    {
        // Usuários autenticados podem ter aprovação automática
        if ($user) {
            return 'approved';
        }

        // Comentários de visitantes sempre vão para moderação
        return 'pending';
    }

    private function generateGravatar($email, $size = 80): string
    {
        $hash = md5(strtolower(trim($email)));
        return "https://www.gravatar.com/avatar/{$hash}?s={$size}&d=mp";
    }

    /**
     * API para administração - Moderar comentários
     */
    public function moderateComment(Request $request, $commentId)
    {
        if (!auth()->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Não autorizado'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'action' => 'required|in:approve,reject,spam'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $comment = PostComment::findOrFail($commentId);
            $oldStatus = $comment->status;

            switch ($request->action) {
                case 'approve':
                    $comment->update([
                        'status' => 'approved',
                        'approved_at' => now()
                    ]);

                    // Incrementar contador se for comentário principal
                    if (!$comment->parent_id && $oldStatus !== 'approved') {
                        $comment->post->increment('comments_count');
                    }
                    break;

                case 'reject':
                    $comment->update(['status' => 'rejected']);

                    // Decrementar contador se foi aprovado anteriormente
                    if (!$comment->parent_id && $oldStatus === 'approved') {
                        $comment->post->decrement('comments_count');
                    }
                    break;

                case 'spam':
                    $comment->update(['status' => 'spam']);

                    // Decrementar contador se foi aprovado anteriormente
                    if (!$comment->parent_id && $oldStatus === 'approved') {
                        $comment->post->decrement('comments_count');
                    }
                    break;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Comentário moderado com sucesso',
                'comment' => $comment
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erro ao moderar comentário: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Estatísticas de engajamento
     */
    public function getStats($postId)
    {
        try {
            $post = Post::findOrFail($postId);

            $stats = [
                'total_likes' => $post->likes,
                'total_comments' => $post->comments_count,
                'user_has_liked' => auth()->user() ? $post->isLikedByUser(auth()->id()) : false,
                'top_comments' => PostComment::with('user')
                    ->where('post_id', $postId)
                    ->approved()
                    ->orderBy('likes_count', 'desc')
                    ->limit(3)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao carregar estatísticas: ' . $e->getMessage()
            ], 500);
        }
    }
}
