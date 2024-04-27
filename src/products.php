<?php
$listFilePath = "products.json";

header('Content-Type: application/json; charset=utf-8');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        $list = [];
        if (file_exists($listFilePath)) {
            $list = json_decode(file_get_contents($listFilePath), true);
            if ($list === null) {
                $list = [];
            }
        }

        echo json_encode($list);
        return;
    case "POST":
        if (isset($_POST["name"])) {
            $productName = trim($_POST["name"]);
            if (empty($productName)) {
                http_response_code(400);
                echo json_encode(array("success" => false, "message" => "Nazwa produktu nie może być pusta"));
                return;
            }

            $list = [];
            if (file_exists($listFilePath)) {
                $list = json_decode(file_get_contents($listFilePath), true);
            }

            $currentDate = date("Y-m-d H:i:s");
            $product = array(
                "id" => uniqid(),
                "name" => $productName,
                "disabled" => false,
                "created_at" => $currentDate,
                "modified_at" => $currentDate
            );
            $list[] = $product;

            if (file_put_contents($listFilePath, json_encode($list, JSON_PRETTY_PRINT))) {
                echo json_encode(array("success" => true, "message" => "Element został dodany", "item" => $product));
            } else {
                http_response_code(500);
                echo json_encode(array("success" => false, "message" => "Wystąpił błąd podczas dodawania elementu"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("success" => false, "message" => "Nie podano danych"));
        }
        break;
    case "PUT":
        if (isset($_GET["id"]) && isset($_GET["disabled"])) {
            $productId = $_GET["id"];
            $productDisabled = $_GET["disabled"] === "1";
            if (file_exists($listFilePath)) {
                $list = json_decode(file_get_contents($listFilePath), true);

                $foundProduct = null;
                foreach ($list as &$product) {
                    if ($product["id"] === $productId) {
                        $product["disabled"] = $productDisabled;
                        $product["modified_at"] = date("Y-m-d H:i:s");
                        $foundProduct = $product;
                        break;
                    }
                }
                unset($product);

                if ($foundProduct === null) {
                    http_response_code(404);
                    echo json_encode(array("success" => false, "message" => "Produkt o podanym ID nie został znaleziony"));
                } else {
                    if (file_put_contents($listFilePath, json_encode($list, JSON_PRETTY_PRINT))) {
                        echo json_encode(array("success" => true, "message" => "Element został zmieniony", "item" => $foundProduct));
                    } else {
                        http_response_code(500);
                        echo json_encode(array("success" => false, "message" => "Błąd podczas zmiany elementu"));
                    }
                }
            } else {
                http_response_code(404);
                echo json_encode(array("success" => false, "message" => "Plik z listą zakupów nie istnieje"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("success" => false, "message" => "Nie podano danych"));
        }
        break;
    case "DELETE":
        if (isset($_GET["id"])) {
            $productId = $_GET["id"];
            if (file_exists($listFilePath)) {
                $list = json_decode(file_get_contents($listFilePath), true);
                $found = false;

                foreach ($list as $key => $product) {
                    if ($product["id"] === $productId) {
                        unset($list[$key]);
                        $found = true;
                        break;
                    }
                }

                if (!$found) {
                    http_response_code(404);
                    echo json_encode(array("success" => false, "message" => "Produkt o podanym ID nie został znaleziony"));
                } else {
                    if (file_put_contents($listFilePath, json_encode(array_values($list), JSON_PRETTY_PRINT))) {
                        echo json_encode(array("success" => true, "message" => "Element usunięty z listy zakupów"));
                    } else {
                        http_response_code(500);
                        echo json_encode(array("success" => false, "message" => "Błąd podczas usuwania elementu"));
                    }
                }
            } else {
                http_response_code(404);
                echo json_encode(array("success" => false, "message" => "Plik z listą zakupów nie istnieje"));
            }
        } else {
            if (file_put_contents($listFilePath, json_encode(array_values([]), JSON_PRETTY_PRINT))) {
                echo json_encode(array("success" => true, "message" => "Listy zakupów została wyczyszczona"));
            } else {
                http_response_code(500);
                echo json_encode(array("success" => false, "message" => "Błąd podczas usuwania elementu"));
            }
        }
        return;
    default:
        http_response_code(405);
        echo json_encode(array("success" => false, "message" => "Nieobsługiwana metoda żądania"));
}
