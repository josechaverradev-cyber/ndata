import pymysql

# Configuración de Base de Datos
DATABASE_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "ndata"
}

def drop_problematic_tables():
    try:
        connection = pymysql.connect(**DATABASE_CONFIG)
        with connection.cursor() as cursor:
            # Desactivar restricciones de llaves foráneas para poder borrar
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
            
            tables_to_drop = [
                "meal_tracking", 
                "water_tracking", 
                "meal_food_items", 
                "notifications",
                "messages"
            ]
            
            for table in tables_to_drop:
                print(f"Borrando tabla: {table}")
                cursor.execute(f"DROP TABLE IF EXISTS {table};")
            
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
            connection.commit()
            print("Tablas borradas exitosamente.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'connection' in locals():
            connection.close()

if __name__ == "__main__":
    drop_problematic_tables()
