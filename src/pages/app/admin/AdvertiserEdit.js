import React, { useState, useEffect } from "react";
import config from "../../../config";

const AdvertiserEdit = ({ advertiserId, onClose, onRefresh }) => {
  const [name, setName] = useState("");
  const [type_id, setType] = useState();
  const [category_id, setCategory] = useState();
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Загрузка данных о рекламодателе и типов
  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await fetch(`${config.api}/admin/advertisers/${advertiserId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setType(data.type?.id || "");
          setCategory(data.category?.id || "");
        } else {
          throw new Error("Ошибка загрузки данных рекламодателя");
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки данных");
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await fetch(`${config.api}/admin/advertiser-type/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTypes(data.results);
        } else {
          throw new Error("Ошибка загрузки типов рекламодателей");
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки типов");
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await fetch(`${config.api}/admin/advertiser-category/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error("Не удалось загрузить категории");
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки категорий");
      }
    };

    fetchAdvertiser();
    fetchTypes();
    fetchCategory();
  }, [advertiserId]);

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${config.api}/admin/advertisers/edit/${advertiserId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ name, type_id, category_id }),
      });

      if (response.ok) {
        await onRefresh(); // Обновляем список рекламодателей
        onClose(); // Закрываем попап
      } else {
        const data = await response.json();
        setError(data.detail || "Ошибка обновления рекламодателя");
      }
    } catch (err) {
      console.error(err);
      setError("Ошибка отправки данных");
    }
  };

  return (
    <div className="popup">
      <div className="popup-container">
        <div className="popup-content">
          <h3>Редактировать Рекламодателя</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Название</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Тип</label>
              <select
                id="type"
                value={type_id}
                onChange={(e) => setType(Number(e.target.value))}
                required
              >
                <option value="">Выберите тип</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Категория</label>
              <select
                id="category"
                value={category_id}
                onChange={(e) => setCategory(Number(e.target.value))}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={onClose}>
                Закрыть
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserEdit;
