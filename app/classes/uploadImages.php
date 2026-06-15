<?php
namespace App\classes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;


class UploadImages {
    public function Upload($destination, $image)
    {
        $path = public_path("$destination/");

        if (!File::isDirectory($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        $image = explode(",", $image);
        $ext = "";
        $extension = collect(['gif', 'png', 'jpg', 'jpeg']);

        $part1 = substr($image[0], strpos($image[0], '/') + 1);
        $ext = str_replace(";base64", "", $part1);

        if ($extension->contains($ext)) {
            $imageManager = new ImageManager(new Driver());
            $img = $imageManager->read($image[1]);
            $filename = Str::random() . "." . $ext;
            $img->toPng(quality: 50)->save("$destination/" . $filename);
            return "$destination/".$filename;
        }
    }
}
