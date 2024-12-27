import React, { useState, useEffect } from "react";
import Select from "react-select";
import config from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";

const AdminImages = () => {
  const [images, setImages] = useState([]);
  const [currentUrl, setCurrentUrl] = useState(`${config.api}/admin/images`); // Текущий URL для API
  const [nextPage, setNextPage] = useState(null); // URL следующей страницы
  const [previousPage, setPreviousPage] = useState(null); // URL предыдущей страницы
  const [editingId, setEditingId] = useState(null); // ID изображения, которое редактируется
  const [newCreativeId, setNewCreativeId] = useState(null);
  const [creativeOptions, setCreativeOptions] = useState([]);
  const [isCreativeLoading, setIsCreativeLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null); // Для открытого изображения
  


  useEffect(() => {
    fetchImages(currentUrl); // Загрузка первой страницы
    loadCreatives("");
  }, []);

  const fetchImages = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.results);
        setCurrentUrl(url); // Обновляем текущий URL
        setNextPage(data.next); // Устанавливаем URL следующей страницы
        setPreviousPage(data.previous); // Устанавливаем URL предыдущей страницы
      } else {
        throw new Error("Ошибка загрузки изображений");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const handleEditClick = (imageId) => {
    const image = images.find((img) => img.id === imageId); // Находим изображение по ID

    if (!image) {
      console.error("Изображение не найдено");
      return;
    }
    setNewCreativeId({ id: "", name: "" })
    setEditingId(imageId);
  };

  const handleSaveClick = async (imageId, CreativeId) => {
    try {
      const response = await fetch(`${config.api}/admin/images/edit/${imageId}/`, {
        method: "PATCH", // PATCH для частичного обновления
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creative_id: newCreativeId.id || CreativeId,
        }),
      });

      if (response.ok) {
        fetchImages(currentUrl); // Обновляем список изображений после сохранения
        setEditingId(null); // Завершаем редактирование
        setNewCreativeId(null)
      } else {
        throw new Error("Ошибка при сохранении");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const loadCreatives = async (inputValue) => {
    setIsCreativeLoading(true);
    const sanitizedInputValue = typeof inputValue === 'string' ? inputValue : '';
    
    try {
      const response = await fetch(`${config.api}/admin/creatives/?search=${sanitizedInputValue}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const options = data.results.map((creative) => ({
          value: creative.id,
          label: creative.name,
        }));
        setCreativeOptions(options); // Обновляем список креативов
      } else {
        throw new Error("Ошибка загрузки креативов");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setIsCreativeLoading(false);
    }
  };
  
  const openFullscreenImage = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };


  return (
    <div className="invoices-container">
      {images.length > 0 ? (
        <div className="section">
          <h2>Все фото</h2>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Креатив</th>
                <th>Рекламодатель</th>
                <th>Дата загрузки</th>
                <th>Фото</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image.id}>
                  <td>{image.id}</td>
                  <td>
                    {editingId === image.id ? (
                      <Select
                        placeholder="Выберите креатив"
                        isClearable
                        // isSearchable
                        isLoading={isCreativeLoading}
                        // onInputChange={loadCreatives} // Обрабатываем поиск
                        options={creativeOptions}
                        onInputChange={(inputValue) => {
                          loadCreatives(inputValue || ""); // Обеспечиваем, что всегда передается строка
                        }}                        
                        onChange={(selectedOption) =>
                          setNewCreativeId(selectedOption ? { id: selectedOption.value, name: selectedOption.label } : { id: "", name: "" })
                        }
                        value={
                          newCreativeId.id
                            ? { value: newCreativeId.id, label: newCreativeId.name } // Используем newCreativeId, если оно есть
                            : image.creative
                            ? { value: image.creative.id, label: image.creative.name } // Если newCreativeId пусто, берем данные из image
                            : null // Если нет данных вообще
                        }
                      />
                    ) : (
                      image.creative ? image.creative.name : "Нет креатива"
                    )}
                  </td>

                  <td>{image.creative ? image.creative.advertiser.name : "Нет рекламодателя"}</td>
                  <td>{image.uploaded_at}</td>
                  <td>
                    <img
                      src={image.image_file}
                      alt="Изображение"
                      style={{ width: "100px", height: "auto" }}
                      onClick={() => openFullscreenImage(image.image_file)}
                    />
                  </td>
                  <td>
                    {editingId === image.id ? (
                      <button 
                          // onClick={() => handleSaveClick(image.id)}
                          onClick={() => handleSaveClick(image.id, image.creative ? image.creative.id : null)}
                    >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                    ) : (
                      <button onClick={() => handleEditClick(image.id)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => fetchImages(previousPage)}
              disabled={!previousPage}
            >
              Назад
            </button>
            <button
              onClick={() => fetchImages(nextPage)}
              disabled={!nextPage}
            >
              Далее
            </button>
          </div>
        </div>
      ) : (
        <p>Нет фото</p>
      )}
      {/* Модальное окно для полноэкранного изображения */}
      {fullscreenImage && (
        <div className="fullscreen-modal" onClick={closeFullscreenImage}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={fullscreenImage}
              alt="Полноэкранное изображение"
              className="fullscreen-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImages;
